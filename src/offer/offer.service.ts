import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId, Number } from "mongoose";
import { FileService, FileType } from "../file/file.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { Offer, OfferDocument } from "./schemas/offer.schema";
import { errorCatcher, getNearbyOffers } from "../utils";
import { Endpoints } from "../const";
import { CommentDocument } from "src/comment/schemas/comment.schemas";

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
		previewImage: File | string,
		images: File[] | string[]
	): Promise<Offer> {
		const goods = dto.goods.split("; ");
		const location = {
			latitude: dto.latitude,
			longitude: dto.longitude,
			zoom: dto.zoom,
		};
		const previewImageImagePath =
			typeof previewImage === "string"
				? previewImage
				: this.fileService.createFile(FileType.IMAGE, previewImage);

		const gallery =
			typeof images[0] === "string"
				? images
				: images.map((img) => this.fileService.createFile(FileType.IMAGE, img));

		const offer = await (
			await this.offerModel.create({
				...dto,
				goods,
				comments: [],
				location,
				rating: 0,
				previewImage: previewImageImagePath,
				images: gallery,
			})
		).populate([Endpoints.USER, Endpoints.CITY]);
		return offer;
	}

	async update(
		dto: CreateOfferDto,
		previewImage: File | string,
		images: File[] | string[],
		id: ObjectId
	): Promise<Offer> {
		const goods = dto.goods.split("; ");
		const location = {
			latitude: dto.latitude,
			longitude: dto.longitude,
			zoom: dto.zoom,
		};
		const previewImageImagePath =
			typeof previewImage === "string"
				? previewImage
				: this.fileService.createFile(FileType.IMAGE, previewImage);

		const gallery =
			typeof images[0] === "string"
				? images
				: images.map((img) => this.fileService.createFile(FileType.IMAGE, img));

		let offer = await (
			await this.offerModel.findByIdAndUpdate(id, {
				...dto,
				goods,
				location,
				previewImage: previewImageImagePath,
				images: gallery,
			})
		).populate([Endpoints.USER, Endpoints.CITY]);

		offer = await this.offerModel
			.findById(id)
			.populate([Endpoints.USER, Endpoints.CITY]);

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

		const allOffers = await this.offerModel
			.find({
				city: offer.city,
			})
			.populate([Endpoints.USER, Endpoints.CITY]);
		const nearbyOffers = getNearbyOffers(offer, allOffers, 3);
		offer.nearbyOffers = nearbyOffers;
		return offer;
	}

	async delete(id: ObjectId): Promise<ObjectId> {
		try {
			const offer = await this.offerModel.findByIdAndDelete(id);
			this.fileService.removeFile(
				FileType.IMAGE,
				offer.previewImage.slice(FileType.IMAGE.length + 1)
			);
			offer.images.forEach((imagePath) => {
				this.fileService.removeFile(
					FileType.IMAGE,
					imagePath.slice(FileType.IMAGE.length + 1)
				);
			});
			return offer.id;
		} catch (err) {
			errorCatcher("Offer with this id does not exist", HttpStatus.BAD_REQUEST);
		}
	}

	async addComment(comment: CommentDocument): Promise<Offer> {
		try {
			const {
				description,
				offer: offerId,
				rating,
				user,
				_id,
				createdAt,
				updatedAt,
			} = comment;
			const offer = await this.offerModel.findById(offerId);
			offer.comments.push({
				user,
				description,
				_id,
				rating,
				createdAt,
				updatedAt,
			});
			if (offer.comments.length > 0) {
				const ratingSum = offer.comments.reduce(
					(sum, offer) => sum + Number(offer.rating),
					0
				);
				const len = offer.comments.length;
				offer.rating = Number((ratingSum / len).toFixed(1));
			}
			offer.save();
			return offer;
		} catch (err) {
			errorCatcher(err.message, HttpStatus.BAD_REQUEST);
		}
	}

	async removeComment(comment: CommentDocument): Promise<Offer> {
		const offer = await this.offerModel.findById(comment.offer);
		offer.comments = offer.comments.filter((c: CommentDocument) => {
			return c._id.toString() !== comment._id.toString();
		});
		offer.save();
		return offer;
	}

	async updateComment(comment: CommentDocument): Promise<Offer> {
		const { description, user, _id, createdAt, updatedAt }: CommentDocument =
			comment;

		const offer = await this.offerModel.findById(comment.offer);
		offer.comments = offer.comments.filter((c: CommentDocument) => {
			return c._id.toString() !== comment._id.toString();
		});
		offer.comments.push({ user, description, _id, createdAt, updatedAt });
		offer.save();
		return offer;
	}
}
