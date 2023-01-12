import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { FileService, FileType } from "src/file/file.service";
import { CreateHostDto } from "./dto/create-host.dto";
import { Host, HostDocument, UserRoles } from "./schemas/host.schema";
import { errorCatcher } from "../utils/errorCatcher";

@Injectable()
export class HostService {
	constructor(
		@InjectModel(Host.name) private hostModel: Model<HostDocument>,
		private fileService: FileService
	) {}

	async create(dto: CreateHostDto, image): Promise<Host> {
		const imagePath = this.fileService.createFile(FileType.IMAGE, image);
		try {
			const role = !dto.role ? [UserRoles.USER] : [...dto.role];

			const host = await this.hostModel.create({
				...dto,
				role,
				avatarUrl: imagePath,
			});
			return host;
		} catch (err) {
			let errorMessage = err.message;
			console.log(err.message);
			if (err.message.indexOf("number:")) {
				errorMessage = "Phone number must be unique";
			}

			if (err.message.indexOf("email:")) {
				errorMessage = "Email must be unique";
			}

			errorCatcher(errorMessage, HttpStatus.BAD_REQUEST);
		}
	}

	async getAll(): Promise<Host[]> {
		const hosts = await this.hostModel.find();
		return hosts;
	}

	async getOne(id: ObjectId): Promise<Host> {
		const host = await this.hostModel.findById(id);
		return host;
	}

	async delete(id: ObjectId): Promise<ObjectId> {
		const host = await this.hostModel.findByIdAndDelete(id);
		return host.id;
	}
}
