import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { ObjectId } from "mongoose";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateHostDto } from "./dto/create-host.dto";
import { HostService } from "./host.service";

@Controller("/host")
export class HostController {
	constructor(private hostService: HostService) {}

	@Post()
	@UseInterceptors(FileFieldsInterceptor([{ name: "image", maxCount: 1 }]))
	create(@UploadedFiles() files, @Body() dto: CreateHostDto) {
		const image = files?.image?.[0] ? files.image[0] : "";
		return this.hostService.create(dto, image);
	}

	@Get()
	getAll() {
		return this.hostService.getAll();
	}

	@Get(":id")
	getOne(@Param("id") id: ObjectId) {
		return this.hostService.getOne(id);
	}

	@Delete(":id")
	delete(@Param("id") id: ObjectId) {
		return this.hostService.delete(id);
	}
}
