import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Offer, OfferSchema } from "./schemas/offer.schema";
import { offerController } from "./offer.controller";
import { OfferService } from "./offer.service";
import { FileService } from "../file/file.service";
import { User, UserSchema } from "../user/schemas/user.schema";
import { UserService } from "../user/user.service";
import { City, CitySchema } from "../city/schemas/city.schema";
import { CityService } from "../city/city.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }]),
		MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [offerController],
	providers: [OfferService, FileService, UserService, CityService],
	exports: [OfferService],
})
export class OfferModule {}
