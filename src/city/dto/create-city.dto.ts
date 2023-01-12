export interface ILocation {
	latitude: number;
	longitude: number;
	zoom: number;
}

export class CreateCityDto {
	name: string;
	location: ILocation;
}
