import { ILocation } from "../city/dto/create-city.dto";
import { Offer, OfferDocument } from "../offer/schemas/offer.schema";
import { getDistanceBetweenLocations } from "./";

export const getNearbyOffers = (
	currentLocation: ILocation,
	offersList: OfferDocument[],
	limit: number
) => {
	const result = [];

	if (offersList.length === 0) {
		return result;
	}

	for (let i = 0; i < limit; i++) {
		const nearestOffer = offersList.reduce((a, b) => {
			if (result.some((item) => item?._id === a._id)) {
				return b;
			}

			if (result.some((item) => item?._id === b._id)) {
				return a;
			}

			return getDistanceBetweenLocations(
				{
					latitude: currentLocation.latitude,
					longitude: currentLocation.longitude,
				},
				{
					latitude: a.location.latitude,
					longitude: a.location.longitude,
				}
			) >
				getDistanceBetweenLocations(
					{
						latitude: currentLocation.latitude,
						longitude: currentLocation.longitude,
					},
					{
						latitude: b.location.latitude,
						longitude: b.location.longitude,
					}
				)
				? b
				: a;
		});

		result.push(nearestOffer);
	}

	return result;
};
