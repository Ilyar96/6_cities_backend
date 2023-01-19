import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { FileService, FileType } from "../file/file.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { Offer, OfferDocument } from "./schemas/offer.schema";
import { errorCatcher, getNearbyOffers } from "../utils";
import { Endpoints } from "../const";

export interface IData {
	offersCount: number;
	pagesCount: number;
	data: Offer[];
}

@Injectable()
export class OfferService {
	constructor(
		@InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
		private fileService: FileService
	) {}

	async create(
		dto: CreateOfferDto,
		previewImage: File,
		galleryImages: File[]
	): Promise<Offer> {
		const previewImageImagePath = this.fileService.createFile(
			FileType.IMAGE,
			previewImage
		);
		const gallery = galleryImages.map((img) =>
			this.fileService.createFile(FileType.IMAGE, img)
		);

		const offer = await (
			await this.offerModel.create({
				...dto,
				previewImage: previewImageImagePath,
				images: gallery,
			})
		).populate([Endpoints.USER, Endpoints.CITY]);
		return offer;
	}

	async getAll(
		sortBy: string = "createdAt",
		order: string = "asc",
		limit: number = 10,
		page: number = 1,
		cityId: ObjectId
	): Promise<IData> {
		const filter = cityId ? { city: cityId } : null;
		const offersCount = (await this.offerModel.find(filter)).length;
		const pagesCount = Math.ceil(offersCount / limit);
		const offers = await this.offerModel
			.find(filter)
			.limit(limit)
			.sort({ [sortBy]: order.toLowerCase() === "asc" ? 1 : -1 })
			.skip(limit * (page - 1))
			.populate([Endpoints.USER, Endpoints.CITY]);

		const data = {
			offersCount,
			pagesCount,
			data: offers,
		};
		return data;
	}

	async getOne(id: ObjectId): Promise<Offer> {
		const offer = await this.offerModel
			.findById(id)
			.populate([Endpoints.USER, Endpoints.CITY]);

		if (!offer) {
			errorCatcher("Offer with this id does not exist", HttpStatus.BAD_REQUEST);
		}

		const allOffers = await this.offerModel.find({
			city: offer.city,
		});
		const nearbyOffers = getNearbyOffers(offer, allOffers, 3);
		offer.nearbyOffers = nearbyOffers;

		return offer;
	}

	async delete(id: ObjectId): Promise<ObjectId> {
		try {
			const offer = await this.offerModel.findByIdAndDelete(id);
			return offer.id;
		} catch (err) {
			errorCatcher("Offer with this id does not exist", HttpStatus.BAD_REQUEST);
		}
	}
}
