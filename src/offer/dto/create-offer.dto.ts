import { ObjectId } from "mongoose";
import { ILocation } from "../../city/dto/create-city.dto";

export class CreateOfferDto {
	readonly city: ObjectId;
	readonly title: string;
	readonly isPremium: boolean;
	readonly rating: number;
	readonly type: string;
	readonly bedrooms: number;
	readonly maxAdults: number;
	readonly price: number;
	readonly goods: string[];
	readonly host: ObjectId;
	readonly address: string;
	readonly description: string;
	readonly location: ILocation;
}
