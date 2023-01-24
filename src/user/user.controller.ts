import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { ObjectId } from "mongoose";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { UserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { UserRoles } from "./schemas/user.schema";
import { Endpoints } from "../const";

@Controller(Endpoints.USER)
export class UserController {
	constructor(private userService: UserService) {}

	@Post()
	@UseInterceptors(FileFieldsInterceptor([{ name: "avatarUrl", maxCount: 1 }]))
	create(@UploadedFiles() files, @Body() dto: UserDto) {
		let image = "";
		if (files?.avatarUrl?.[0]) {
			image = files.avatarUrl[0];
		}
		if (dto.avatarUrl) {
			image = dto.avatarUrl;
		}
		return this.userService.create(dto, image);
	}

	@Get()
	getAll() {
		return this.userService.getAll();
	}

	@Get("role/:role")
	getAllByUserRole(@Param("role") role: UserRoles) {
		return this.userService.getAllByUserRole(role);
	}

	@Get(":id")
	getOne(@Param("id") id: ObjectId) {
		return this.userService.getOne(id);
	}

	@Delete(":id")
	delete(@Param("id") id: ObjectId) {
		return this.userService.delete(id);
	}

	@Patch(":userId/:id")
	addFavoriteOffer(
		@Param("userId") userId: ObjectId,
		@Param("id") id: ObjectId
	) {
		return this.userService.addFavoriteOffer(userId, id);
	}

	@Delete(":userId/:id")
	removeFavoriteOffer(
		@Param("userId") userId: ObjectId,
		@Param("id") id: ObjectId
	) {
		return this.userService.removeFavoriteOffer(userId, id);
	}
}
