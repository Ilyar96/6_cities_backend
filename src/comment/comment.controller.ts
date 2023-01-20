import {
	Body,
	Controller,
	Param,
	Post,
	UploadedFiles,
	UseInterceptors,
	Headers,
	Get,
	Delete,
	Patch,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { Endpoints } from "../const";
import { ObjectId } from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller(Endpoints.COMMENT)
export class CommentController {
	constructor(private commentService: CommentService) {}

	@Post()
	create(@Body() dto: CreateCommentDto) {
		return this.commentService.create(dto);
	}

	@Get()
	getAll() {
		return this.commentService.getAll();
	}

	@Get(":id")
	getOne(@Param("id") id: ObjectId) {
		return this.commentService.getOne(id);
	}

	@Delete(":id")
	delete(@Param("id") id: ObjectId) {
		return this.commentService.delete(id);
	}

	@Patch(":id")
	update(@Param("id") id: ObjectId, @Body() dto: CreateCommentDto) {
		return this.commentService.update(id, dto);
	}
}
