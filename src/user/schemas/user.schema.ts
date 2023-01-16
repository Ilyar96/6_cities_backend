import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId } from "mongoose";
import { Offer } from "src/offer/schemas/offer.schema";

export type UserDocument = HydratedDocument<User>;

export enum UserRoles {
	ADMIN = "ADMIN",
	USER = "USER",
	HOST = "HOST",
}

@Schema()
export class User {
	@Prop()
	name: string;

	@Prop({ required: false })
	role: UserRoles[];

	@Prop()
	isPro: boolean;

	@Prop()
	avatarUrl: string;

	@Prop({ type: Number, unique: true, isRequired: true })
	phone: number;

	@Prop({ type: String, unique: true, isRequired: true })
	email: string;

	@Prop({
		required: false,
	})
	favorites: Array<Offer>;
}

export const UserSchema = SchemaFactory.createForClass(User);
