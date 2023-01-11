import { HttpException, HttpStatus } from "@nestjs/common";

export const errorCatcher = (message: string, status: HttpStatus | number) => {
	throw new HttpException(message, status);
};
