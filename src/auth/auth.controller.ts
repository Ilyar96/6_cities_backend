import {
	Body,
	Controller,
	Param,
	Post,
	UploadedFiles,
	UseInterceptors,
	Headers,
	Get,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ObjectId } from "mongoose";
import { Endpoints } from "src/const";
import { UserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";

@Controller(Endpoints.AUTH)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("/login")
	login(@Body() userDto: UserDto) {
		return this.authService.login(userDto);
	}

	@Post("/registration")
	@UseInterceptors(FileFieldsInterceptor([{ name: "image", maxCount: 1 }]))
	registration(@UploadedFiles() files, @Body() userDto: UserDto) {
		const image = files?.image?.[0] ? files.image[0] : "";
		return this.authService.registration(userDto, image);
	}

	@Get("/me")
	authMe(@Headers() headers) {
		const token = headers.authorization ? headers.authorization : "";
		return this.authService.authMe(token);
	}
}
