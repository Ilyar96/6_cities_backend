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
	getAll(
		@Query("sortBy") sortBy: string,
		@Query("order") order: string,
		@Query("limit") limit: number,
		@Query("page") page: number,
		@Query("cityId") cityId: ObjectId
	) {
		return this.offerService.getAll(sortBy, order, limit, page, cityId);
	}

	@Get(":id")
	getOne(@Param("id") id: ObjectId) {
		return this.offerService.getOne(id);
	}

	@Delete(":id")
	delete(@Param("id") id: ObjectId) {
		return this.offerService.delete(id);
	}
}
