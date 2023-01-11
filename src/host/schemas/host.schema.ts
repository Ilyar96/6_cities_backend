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
}

export const HostSchema = SchemaFactory.createForClass(Host);
