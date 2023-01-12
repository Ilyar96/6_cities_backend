import { ILocation } from "../city/dto/create-city.dto";

export type LocationType = Omit<ILocation, "zoom">;

export const getDistanceBetweenLocations = (
	{ latitude: lat1, longitude: lon1 }: LocationType,
	{ latitude: lat2, longitude: lon2 }: LocationType
): number => {
	const R = 6371e3; // metres
	const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // in metres

	return d;
};
