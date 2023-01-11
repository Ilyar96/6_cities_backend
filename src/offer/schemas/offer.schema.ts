import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Host } from "../../host/schemas/host.schema";

export type OfferDocument = HydratedDocument<Offer>;

@Schema()
class Location {
	@Prop({ type: Number })
	latitude: number;

	@Prop({ type: Number })
	longitude: number;

	@Prop({ type: Number })
	zoom: number;
}

@Schema()
class City {
	@Prop({ type: String })
	name: string;

	@Prop({ type: Location })
	location: Location;
}

@Schema()
export class Offer {
	@Prop({ type: City })
	city: City;

	@Prop({ type: String })
	title: string;

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

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Host" })
	host: Host;

	@Prop({ type: String })
	description: string;

	@Prop({ type: Location })
	location: Location;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
