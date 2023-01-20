import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { OfferModule } from "src/offer/offer.module";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Auth, AuthSchema } from "./schemas/auth.schemas";

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
		forwardRef(() => UserModule),
		JwtModule.register({
			secret: process.env.PRIVATE_KEY || "SECRET",
			signOptions: {
				expiresIn: "24h",
			},
		}),
	],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
