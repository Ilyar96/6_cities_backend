import {
	Body,
	Controller,
	Post,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { UserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
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
}
