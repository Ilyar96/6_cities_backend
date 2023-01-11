import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { ObjectId } from "mongoose";
import { CreateHostDto } from "./dto/create-host.dto";
import { HostService } from "./host.service";

@Controller("/host")
export class HostController {
	constructor(private hostService: HostService) {}

	@Post()
	// @UseInterceptors(
	// 	FileFieldsInterceptor([
	// 		{ name: "picture", maxCount: 1 },
	// 		{ name: "audio", maxCount: 1 },
	// 	])
	// )
	create(@Body() dto: CreateHostDto) {
		return this.hostService.create(dto);
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
