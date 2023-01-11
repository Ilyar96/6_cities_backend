import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Offer, OfferSchema } from "./schemas/offer.schema";
import { offerController } from "./offer.controller";
import { OfferService } from "./offer.service";
import { FileService } from "../file/file.service";
import { Host, HostSchema } from "../host/schemas/host.schema";
import { HostService } from "../host/host.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }]),
		MongooseModule.forFeature([{ name: Host.name, schema: HostSchema }]),
	],
	controllers: [offerController],
	providers: [OfferService, FileService, HostService],
})
export class OfferModule {}
