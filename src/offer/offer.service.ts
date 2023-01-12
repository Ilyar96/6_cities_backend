import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { HostService } from "../host/host.service";
import { FileService, FileType } from "../file/file.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { Offer, OfferDocument } from "./schemas/offer.schema";
import { errorCatcher, getNearbyOffers } from "../utils";

@Injectable()
export class OfferService {
	constructor(
		@InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
		private hostModel: HostService,
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
		).populate(["host", "city"]);
		return offer;
	}

	async getAll(): Promise<Offer[]> {
		const offers = await this.offerModel.find().populate("host");
		return offers;
	}

	async getOne(id: ObjectId): Promise<Offer> {
		const offer = await this.offerModel.findById(id).populate(["host", "city"]);

		if (!offer) {
			errorCatcher("Host with this id does not exist", HttpStatus.BAD_REQUEST);
		}

		const allOffers = await this.offerModel.find().populate(["host", "city"]);
		const nearbyOffers = getNearbyOffers(offer.location, allOffers, 3);
		offer.nearbyOffers = nearbyOffers;

		return offer;
	}

	async delete(id: ObjectId): Promise<ObjectId> {
		try {
			const offer = await this.offerModel.findByIdAndDelete(id);
			return offer.id;
		} catch (err) {
			errorCatcher("Host with this id does not exist", HttpStatus.BAD_REQUEST);
		}
	}
}
