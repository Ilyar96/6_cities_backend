import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";
import { OfferModule } from "./offer/offer.module";
import { FileModule } from "./file/file.module";
import { HostModule } from "./host/host.module";
import { CityController } from './city/city.controller';
import { CityModule } from './city/city.module';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: path.resolve(__dirname, "static"),
		}),
		MongooseModule.forRoot(
			"mongodb+srv://ilyar:X0T16ScOhy3vKd1I@cluster0.cfzt2n8.mongodb.net/6-sities?retryWrites=true&w=majority"
		),
		HostModule,
		FileModule,
		OfferModule,
		CityModule,
	],
	controllers: [CityController],
})
export class AppModule {}
