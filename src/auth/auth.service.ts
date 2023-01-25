import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcryptjs";
import { errorCatcher, getUserDataWithoutPassword } from "src/utils";
import { UserDocument } from "src/user/schemas/user.schema";
import { Model, ObjectId } from "mongoose";
import { Auth, AuthDocument } from "./schemas/auth.schemas";
import { InjectModel } from "@nestjs/mongoose";
import { OfferService } from "src/offer/offer.service";

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(Auth.name) private authModel: Model<AuthDocument>,
		private userService: UserService,
		private jwtService: JwtService
	) {}

	async login(userDto: UserDto) {
		const user = await this.validateUser(userDto);
		const { token } = await this.generateToken(user);
		return getUserDataWithoutPassword(user, token);
	}

	async registration(userDto: UserDto, avatarUrl) {
		const candidate = await this.userService.getUserByEmail(userDto.email);
		if (candidate) {
			errorCatcher(
				"User with this email already exists",
				HttpStatus.BAD_REQUEST
			);
		}

		const hashPassword = await bcrypt.hash(userDto.password, 5);
		const user = await this.userService.create(
			{
				...userDto,
				password: hashPassword,
			},
			avatarUrl
		);

		const { token } = await this.generateToken(user);

		return getUserDataWithoutPassword(user, token);
	}

	async authMe(token: string) {
		if (token) {
			try {
				const decoded = this.jwtService.verify(token, {
					secret: process.env.PRIVATE_KEY || "SECRET",
				});
				const user = await this.userService.getOne(decoded._id);

				return getUserDataWithoutPassword(user, token);
			} catch (err) {
				errorCatcher(err.message, HttpStatus.FORBIDDEN);
			}
		} else {
			errorCatcher("No token", HttpStatus.FORBIDDEN);
		}
	}

	private async generateToken(user: UserDocument) {
		const payload = {
			_id: user._id,
			name: user.name,
			email: user.email,
		};
		return { token: this.jwtService.sign(payload) };
	}

	private async validateUser(userDto: UserDto) {
		try {
			const user = await this.userService.getUserByEmail(userDto.email);

			if (!user) {
				throw new UnauthorizedException({
					message: "Incorrect email or password",
				});
			}

			const passwordEquals = await bcrypt.compare(
				userDto.password,
				user.password
			);

			if (passwordEquals) {
				return user;
			}
		} catch (err) {
			throw new UnauthorizedException({
				message: err.message,
			});
		}
		throw new UnauthorizedException({
			message: "Incorrect email or password",
		});
	}
}
