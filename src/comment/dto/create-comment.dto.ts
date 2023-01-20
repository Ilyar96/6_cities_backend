import { ObjectId } from "mongoose";

export class CreateCommentDto {
	readonly description: string;
	readonly user: ObjectId;
	readonly offer: ObjectId;
}
