import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { CityService } from "./city.service";
import { CreateCityDto } from "./dto/create-city.dto";
import { Endpoints } from "../const";

@Controller(Endpoints.CITY)
export class CityController {
	constructor(private cityService: CityService) {}

	@Post()
	create(@Body() dto: CreateCityDto) {
		return this.cityService.create(dto);
	}

	@Get()
	getAll() {
		return this.cityService.getAll();
	}

	@Get(":id")
	getOne(@Param("id") id: ObjectId) {
		return this.cityService.getOne(id);
	}

	@Delete(":id")
	delete(@Param("id") id: ObjectId) {
		return this.cityService.delete(id);
	}
}
