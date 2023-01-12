import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Host, HostSchema } from "./schemas/host.schema";
import { HostController } from "./host.controller";
import { HostService } from "./host.service";
import { FileService } from "src/file/file.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Host.name, schema: HostSchema }]),
	],
	controllers: [HostController],
	providers: [HostService, FileService],
	exports: [HostService],
})
export class HostModule {}
