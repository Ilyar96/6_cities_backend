import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";
import { OfferModule } from "./offer/offer.module";
import { FileModule } from "./file/file.module";
import { UserModule } from "./user/user.module";
import { CityModule } from "./city/city.module";
import { AuthModule } from "./auth/auth.module";
import { CommentModule } from "./comment/comment.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.${process.env.NODE_ENV}.env`,
		}),
		ServeStaticModule.forRoot({
			rootPath: path.resolve(__dirname, "static"),
		}),
		MongooseModule.forRoot(process.env.MONGODB_URI_6_CITIES),
		UserModule,
		FileModule,
		OfferModule,
		CityModule,
		AuthModule,
		CommentModule,
	],
	controllers: [],
})
export class AppModule {}
