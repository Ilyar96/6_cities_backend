import {
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcryptjs";
import { errorCatcher } from "src/utils";
import { UserDocument } from "src/user/schemas/user.schema";

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) {}

	async login(userDto: UserDto) {
		const user = await this.validateUser(userDto);
		return this.generateToken(user);
	}

	async registration(userDto: UserDto, image) {
		const candidate = await this.userService.getUserByEmail(userDto.email);
		if (candidate) {
			errorCatcher(
				"Пользователь с таким email уже существует",
				HttpStatus.BAD_REQUEST
			);
		}

		const hashPassword = await bcrypt.hash(userDto.password, 5); // 5 - salt
		const user = await this.userService.create(
			{
				...userDto,
				password: hashPassword,
			},
			image
		);
		return this.generateToken(user);
	}

	private async generateToken(user: UserDocument) {
		const payload = {
			_id: user._id,
			role: user.role,
			isPro: user.isPro,
			avatarUrl: user.avatarUrl,
			phone: user.phone,
			email: user.email,
			favorites: user.favorites,
		};
		return { token: this.jwtService.sign(payload) };
	}

	private async validateUser(userDto: UserDto) {
		const user = await this.userService.getUserByEmail(userDto.email);
		const passwordEquals = await bcrypt.compare(
			userDto.password,
			user.password
		);
		if (user && passwordEquals) {
			return user;
		}
		throw new UnauthorizedException({
			message: "Некорректный email или пароль",
		});
	}
}
