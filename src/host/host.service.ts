import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { CreateHostDto } from "./dto/create-host.dto";
import { Host, HostDocument } from "./schemas/host.schema";

@Injectable()
export class HostService {
	constructor(@InjectModel(Host.name) private hostModel: Model<HostDocument>) {}

	async create(dto: CreateHostDto): Promise<Host> {
		const host = await this.hostModel.create({
			...dto,
		});
		return host;
	}

	async getAll(): Promise<Host[]> {
		const hosts = await this.hostModel.find();
		return hosts;
	}

	async getOne(id: ObjectId): Promise<Host> {
		const host = await this.hostModel.findById(id);
		return host;
	}

	async delete(id: ObjectId): Promise<ObjectId> {
		const host = await this.hostModel.findByIdAndDelete(id);
		return host.id;
	}
}
