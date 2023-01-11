import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type HostDocument = HydratedDocument<Host>;

@Schema()
export class Host {
	@Prop()
	name: string;

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
