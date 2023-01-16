import { UserRoles } from "../schemas/user.schema";
import { ObjectId } from "mongoose";

export class UserDto {
	readonly name: string;
	readonly isPro: boolean;
	readonly email: string;
	readonly phone: number;
	readonly role: UserRoles;
	readonly favorites: ObjectId[];
}
