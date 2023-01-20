export interface ILocation {
	latitude: number;
	longitude: number;
	zoom: number;
}

export class CreateCityDto {
	readonly name: string;
	readonly location: ILocation;
}
