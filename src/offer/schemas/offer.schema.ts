import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Location } from "../../city/schemas/city.schema";
import { Host } from "../../host/schemas/host.schema";
import { City } from "../../city/schemas/city.schema";

export type OfferDocument = HydratedDocument<Offer>;

@Schema()
export class Offer {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "City" })
	city: City;

	@Prop({ type: String })
	title: string;

	@Prop({ type: String })
	previewImage: string;

	@Prop({ type: Array<String> })
	images: string;

	@Prop({ type: Boolean })
	isFavorite: boolean;

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

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Host" })
	host: Host;

	@Prop({ type: String })
	description: string;

	@Prop({ type: Location })
	location: Location;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
