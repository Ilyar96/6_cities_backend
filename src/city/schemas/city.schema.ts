import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CityDocument = HydratedDocument<City>;

@Schema({ _id: false })
export class Location {
	@Prop({ type: Number })
	latitude: number;

	@Prop({ type: Number })
	longitude: number;

	@Prop({ type: Number })
	zoom: number;
}

@Schema()
export class City {
	@Prop({ type: String, unique: true })
	name: string;

	@Prop({ type: Location })
	location: Location;
}

export const CitySchema = SchemaFactory.createForClass(City);
