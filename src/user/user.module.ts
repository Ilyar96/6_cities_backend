import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { FileService } from "src/file/file.service";
import { Offer, OfferSchema } from "src/offer/schemas/offer.schema";
import { OfferService } from "src/offer/offer.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }]),
	],
	controllers: [UserController],
	providers: [UserService, FileService, OfferService],
	exports: [UserService],
})
export class UserModule {}
