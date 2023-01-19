import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Location } from "../../city/schemas/city.schema";
import { User } from "../../user/schemas/user.schema";
import { City } from "../../city/schemas/city.schema";
import { Endpoints } from "../../const";

export type OfferDocument = HydratedDocument<Offer>;

@Schema({ timestamps: true })
export class Offer {
	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: Endpoints.CITY_CAPITALIZE,
	})
	city: City;

	@Prop({ type: String })
	title: string;

	@Prop({ type: String })
	previewImage: string;

	@Prop({ type: Array<String> })
	images: string[];

	@Prop({ type: Boolean })
	isPremium: boolean;

	@Prop({ type: Number })
	rating: number;

	@Prop({ type: String })
	type: string;

	@Prop({ type: Number })
	bedrooms: number;

	@Prop({ type: Number })
	maxAdults: number;

	@Prop({ type: Number })
	price: number;

	@Prop({ type: Array<String> })
	goods: string[];

	@Prop()
	nearbyOffers: Offer[];

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: Endpoints.USER_CAPITALIZE,
	})
	host: User;

	@Prop({ type: String })
	address: string;

	@Prop({ type: String })
	description: string;

	@Prop({ type: Location })
	location: Location;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
