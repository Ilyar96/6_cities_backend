import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";
import { errorCatcher } from "src/utils";

export enum FileType {
	IMAGE = "image",
}

@Injectable()
export class FileService {
	createFile(type: FileType, file): string {
		try {
			const fileExtension = file.originalname.split(".").pop();
			const fileName = uuid.v4() + "." + fileExtension;
			const filePath = path.resolve(__dirname, "..", "static", type);
			if (!fs.existsSync(filePath)) {
				fs.mkdirSync(filePath, { recursive: true });
			}

			fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);

			return type + "/" + fileName;
		} catch (err) {
			throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	removeFile(type: FileType, filePath: string) {
		const dirPath = path.resolve(__dirname, "..", "static", type);
		const fileName = filePath.slice(type.length + 1);
		try {
			fs.unlink(path.resolve(dirPath, filePath), (err) => {
				if (!err) {
					console.log(`File ${fileName} deleted successfully`);
				}
			});
		} catch (err) {
			errorCatcher(`File ${fileName} does not exist`, HttpStatus.BAD_REQUEST);
		}
	}
}
