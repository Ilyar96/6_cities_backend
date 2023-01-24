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
	@UseInterceptors(FileFieldsInterceptor([{ name: "avatarUrl", maxCount: 1 }]))
	registration(@UploadedFiles() files, @Body() userDto: UserDto) {
		let avatarUrl = "";
		if (files?.avatarUrl?.[0]) {
			avatarUrl = files.avatarUrl[0];
		}
		if (userDto.avatarUrl) {
			avatarUrl = userDto.avatarUrl;
		}
		return this.authService.registration(userDto, avatarUrl);
	}

	@Get("/me")
	authMe(@Headers() headers) {
		const token = headers.authorization ? headers.authorization : "";
		return this.authService.authMe(token);
	}
}
