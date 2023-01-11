import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";
import { FileModule } from "./file/file.module";
import { HostModule } from "./host/host.module";

@Module({
	imports: [
		//! https://docs.nestjs.com/recipes/serve-static
		// Позволяет получить доступ к статичным файлам, например по пути http://localhost:5000/image/92d95db4-9a95-441e-8a0b-86e69ca5ec4d.webp
		ServeStaticModule.forRoot({
			rootPath: path.resolve(__dirname, "static"),
		}),
		MongooseModule.forRoot(
			"mongodb+srv://ilyar:X0T16ScOhy3vKd1I@cluster0.cfzt2n8.mongodb.net/6-sities?retryWrites=true&w=majority"
		),
		HostModule,
		FileModule,
	],
})
export class AppModule {}
