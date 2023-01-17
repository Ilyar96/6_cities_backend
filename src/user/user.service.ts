import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { FileService, FileType } from "src/file/file.service";
import { UserDto } from "./dto/create-user.dto";
import { User, UserDocument, UserRoles } from "./schemas/user.schema";
import { errorCatcher } from "../utils/errorCatcher";
import { OfferService } from "../offer/offer.service";
import { OfferDocument } from "src/offer/schemas/offer.schema";

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private fileService: FileService,
		private offerService: OfferService
	) {}

	async create(dto: UserDto, image): Promise<UserDocument> {
		const imagePath = this.fileService.createFile(FileType.IMAGE, image);
		try {
			const role = !dto.role ? [UserRoles.USER] : [...dto.role];
			const favorites = dto.favorites ? [...dto.favorites] : [];

			const user = await await this.userModel.create({
				...dto,
				role,
				favorites,
				avatarUrl: imagePath,
			});

			return user;
		} catch (err) {
			console.log(err);
			let errorMessage = err.message;
			if (err.keyPattern && "phone" in err.keyPattern) {
				errorMessage = "Phone number must be unique";
			}

			if (err.keyPattern && "email" in err.keyPattern) {
				errorMessage = "Email must be unique";
			}

			errorCatcher(errorMessage, HttpStatus.BAD_REQUEST);
		}
	}

	async getAll(): Promise<User[]> {
		const users = await this.userModel.find();
		return users;
	}

	async getAllByUserRole(userRole: UserRoles): Promise<User[]> {
		const offers = await this.userModel.find({ role: userRole }).exec();
		return offers;
	}

	async getOne(id: ObjectId): Promise<any> {
		const user = await this.userModel.findById(id);
		return user;
	}

	async delete(id: ObjectId): Promise<ObjectId> {
		const user = await this.userModel.findByIdAndDelete(id);
		return user.id;
	}

	async addFavoriteOffer(userId: ObjectId, id: ObjectId): Promise<User> {
		const user = await this.userModel.findById(userId);

		if (user.favorites.some((f: any) => f._id === id)) {
			errorCatcher("Already favorited", HttpStatus.BAD_REQUEST);
		}

		const offer = await this.offerService.getOne(id);
		user.favorites.push(offer);
		user.save();
		return user;
	}

	async removeFavoriteOffer(userId: ObjectId, id: ObjectId): Promise<User> {
		const user = await this.userModel.findById(userId);
		const updatedFavorites = user.favorites.filter((offer: OfferDocument) => {
			return offer._id.toString() !== id.toString();
		});
		user.favorites = updatedFavorites;
		user.save();
		return user;
	}

	async getUserByEmail(email: string) {
		const user = await this.userModel.findOne({
			email,
		});
		return user;
	}
}
