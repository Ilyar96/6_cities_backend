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
			{ name: "images", maxCount: 6 },
		])
	)
	create(@UploadedFiles() files, @Body() offerDto: CreateOfferDto) {
		let previewImage = files?.previewImage?.[0] ? files.previewImage[0] : "";
		if (files?.previewImage?.[0]) {
			previewImage = files.previewImage[0];
		}
		if (offerDto.previewImage) {
			previewImage = offerDto.previewImage;
		}

		let galleryImages = [];
		if (files?.images?.[0]) {
			galleryImages = files.images;
		}
		if (offerDto?.images?.length && typeof offerDto?.images[0] === "string") {
			galleryImages = offerDto.images;
		}
		return this.offerService.create(offerDto, previewImage, galleryImages);
	}

	@Post(":id")
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: "previewImage", maxCount: 1 },
			{ name: "images", maxCount: 6 },
		])
	)
	update(
		@UploadedFiles() files,
		@Body() offerDto: CreateOfferDto,
		@Param("id") id: ObjectId
	) {
		let previewImage = files?.previewImage?.[0] ? files.previewImage[0] : "";
		if (files?.previewImage?.[0]) {
			previewImage = files.previewImage[0];
		}
		if (offerDto.previewImage) {
			previewImage = offerDto.previewImage;
		}

		let galleryImages = [];
		if (files?.images?.[0]) {
			galleryImages = files.images;
		}
		if (offerDto?.images?.length && typeof offerDto?.images[0] === "string") {
			galleryImages = offerDto.images;
		}
		return this.offerService.update(offerDto, previewImage, galleryImages, id);
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
