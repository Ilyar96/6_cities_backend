import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Offer, OfferSchema } from "./schemas/offer.schema";
import { offerController } from "./offer.controller";
import { OfferService } from "./offer.service";
import { FileService } from "../file/file.service";
import { Host, HostSchema } from "../host/schemas/host.schema";
import { HostService } from "../host/host.service";
import { City, CitySchema } from "../city/schemas/city.schema";
import { CityService } from "../city/city.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }]),
		MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
		MongooseModule.forFeature([{ name: Host.name, schema: HostSchema }]),
	],
	controllers: [offerController],
	providers: [OfferService, FileService, HostService, CityService],
})
export class OfferModule {}
