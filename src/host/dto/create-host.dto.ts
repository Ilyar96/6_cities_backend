import { UserRoles } from "../schemas/host.schema";

export class CreateHostDto {
	readonly name: string;
	readonly isPro: boolean;
	readonly email: string;
	readonly phone: number;
	readonly role: UserRoles;
}
