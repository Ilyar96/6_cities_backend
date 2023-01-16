import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { FileService, FileType } from "../file/file.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { Offer, OfferDocument } from "./schemas/offer.schema";
import { errorCatcher, getNearbyOffers } from "../utils";
import { Endpoints } from "../const";

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

	async getAll(): Promise<Offer[]> {
		const offers = await this.offerModel
			.find()
			.populate([Endpoints.USER, Endpoints.CITY]);
		return offers;
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

	async getByIds(ids: ObjectId[]): Promise<Offer[]> {
		const offers = await this.offerModel
			.find({ _id: ids })
			.populate([Endpoints.USER, Endpoints.CITY]);

		if (offers.length === 0) {
			errorCatcher(
				"Offers with this ids does not exist",
				HttpStatus.BAD_REQUEST
			);
		}

		return offers;
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
