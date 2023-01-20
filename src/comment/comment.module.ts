import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OfferModule } from "src/offer/offer.module";
import { UserModule } from "src/user/user.module";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { Comment, CommentSchema } from "./schemas/comment.schemas";

@Module({
	controllers: [CommentController],
	providers: [CommentService],
	imports: [
		MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
		forwardRef(() => UserModule),
		forwardRef(() => OfferModule),
	],
})
export class CommentModule {}
