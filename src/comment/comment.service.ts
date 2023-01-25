import { HttpStatus, Injectable } from "@nestjs/common";
import { errorCatcher } from "src/utils";
import { Model, ObjectId } from "mongoose";
import { Comment, CommentDocument } from "./schemas/comment.schemas";
import { InjectModel } from "@nestjs/mongoose";
import { OfferService } from "src/offer/offer.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentService {
	constructor(
		@InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
		private offerService: OfferService
	) {}

	async create(dto: CreateCommentDto): Promise<CommentDocument> {
		try {
			const comment = await (
				await this.commentModel.create({
					...dto,
				})
			).populate(["user"]);

			await this.offerService.addComment(comment);
			return comment;
		} catch (err) {
			errorCatcher(err.message, HttpStatus.BAD_REQUEST);
		}
	}

	async getAll(): Promise<Comment[]> {
		const comments = await this.commentModel.find().populate("user");
		return comments;
	}

	async getOne(id: ObjectId): Promise<Comment> {
		const comment = await this.commentModel.findById(id).populate("user");

		if (!comment) {
			errorCatcher(
				"Comment with this id does not exist",
				HttpStatus.BAD_REQUEST
			);
		}

		return comment;
	}

	async delete(id: ObjectId): Promise<ObjectId> {
		try {
			const comment = await await this.commentModel.findByIdAndDelete(id);
			await this.offerService.removeComment(comment);
			return comment.id;
		} catch (err) {
			errorCatcher(
				"Comment with this id does not exist",
				HttpStatus.BAD_REQUEST
			);
		}
	}

	async update(id: ObjectId, dto: CreateCommentDto): Promise<Comment> {
		try {
			const comment = await await this.commentModel
				.findById(id)
				.populate("user");
			comment.description = dto.description;
			comment.save();
			await this.offerService.updateComment(comment);
			return comment;
		} catch (err) {
			errorCatcher(
				"Comment with this id does not exist",
				HttpStatus.BAD_REQUEST
			);
		}
	}
}
