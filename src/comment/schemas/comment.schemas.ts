import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { Endpoints } from "src/const";
import { Offer } from "src/offer/schemas/offer.schema";
import { User } from "src/user/schemas/user.schema";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
	@Prop({ type: String })
	description: string;

	@Prop({ type: String })
	rating: number;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: Endpoints.USER_CAPITALIZE,
	})
	user: User;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: Endpoints.OFFER_CAPITALIZE,
	})
	offer: Offer;

	@Prop()
	createdAt: Date;

	@Prop()
	updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
