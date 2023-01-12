import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type HostDocument = HydratedDocument<Host>;

export enum UserRoles {
	ADMIN = "ADMIN",
	USER = "USER",
	HOST = "HOST",
}

@Schema()
export class Host {
	@Prop()
	name: string;

	@Prop({ required: false })
	role: UserRoles[];

	@Prop()
	isPro: boolean;

	@Prop()
	avatarUrl: string;

	@Prop({ type: Number, unique: true, isRequired: true })
	phone: number;

	@Prop({ type: String, unique: true, isRequired: true })
	email: string;
}

export const HostSchema = SchemaFactory.createForClass(Host);
