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
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { OfferService } from "./offer.service";
import { ObjectId } from "mongoose";
import { Endpoints } from "../const";

@Controller(Endpoints.OFFER)
export class offerController {
	constructor(private offerService: OfferService) {}

	@Post()
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: "previewImage", maxCount: 1 },
			{ name: "galleryImages", maxCount: 6 },
		])
	)
	create(@UploadedFiles() files, @Body() dto: CreateOfferDto) {
		const previewImage = files?.previewImage?.[0] ? files.previewImage[0] : "";
		const galleryImages = files?.galleryImages?.length
			? files.galleryImages
			: [];
		return this.offerService.create(dto, previewImage, galleryImages);
	}

	@Get()
	getAll() {
		return this.offerService.getAll();
	}

	@Get(":id")
	getOne(@Param("id") id: ObjectId) {
		return this.offerService.getOne(id);
	}

	// @Post("/ids")
	// getByIds(@Body() ids: ObjectId[]) {
	// 	return this.offerService.getByIds(ids);
	// }

	@Delete(":id")
	delete(@Param("id") id: ObjectId) {
		return this.offerService.delete(id);
	}
}
