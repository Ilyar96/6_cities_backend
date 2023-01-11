import { ObjectId } from "mongoose";

export interface ILocation {
	latitude: number;
	longitude: number;
	zoom: number;
}

export interface ICity {
	name: string;
	location: ILocation;
}

export class CreateOfferDto {
	readonly city: ICity;
	readonly title: string;
	readonly isFavorite: boolean;
	readonly isPremium: boolean;
	readonly rating: number;
	readonly type: string;
	readonly bedrooms: number;
	readonly maxAdults: number;
	readonly price: number;
	readonly goods: string[];
	readonly host: ObjectId;
	readonly description: string;
	readonly location: ILocation;
}
