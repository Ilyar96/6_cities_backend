import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { errorCatcher } from "../utils";
import { CreateCityDto } from "./dto/create-city.dto";
import { City, CityDocument } from "./schemas/city.schema";

@Injectable()
export class CityService {
	constructor(@InjectModel(City.name) private cityModel: Model<CityDocument>) {}

	async create(dto: CreateCityDto): Promise<City> {
		try {
			const city = await this.cityModel.create(dto);
			return city;
		} catch (err) {
			if (err.keyValue && "name" in err.keyValue) {
				errorCatcher("City name must be unique", HttpStatus.BAD_REQUEST);
			}
			errorCatcher(err.message, HttpStatus.BAD_REQUEST);
		}
	}

	async getAll(): Promise<City[]> {
		const cities = await this.cityModel.find();
		return cities;
	}

	async getOne(id: ObjectId): Promise<City> {
		const city = await this.cityModel.findById(id);

		if (!city) {
			errorCatcher("City with this id does not exist", HttpStatus.BAD_REQUEST);
		}

		return city;
	}

	async delete(id: ObjectId): Promise<ObjectId> {
		try {
			const city = await this.cityModel.findByIdAndDelete(id);
			return city.id;
		} catch (err) {
			errorCatcher("City with this id does not exist", HttpStatus.BAD_REQUEST);
		}
	}
}
