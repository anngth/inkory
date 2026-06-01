import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";

@ApiTags("comments")
@Controller("articles/:articleId/comments")
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a comment on an article" })
  async create(
    @Param("articleId") articleId: string,
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(
      articleId,
      req.user.id,
      createCommentDto,
    );
  }

  @Get()
  @ApiOperation({ summary: "Get all comments for an article" })
  async findByArticle(
    @Param("articleId") articleId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const { page = 1, limit = 20 } = paginationQuery;
    return this.commentsService.findByArticle(articleId, page, limit);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a comment" })
  async remove(@Param("id") id: string, @Request() req) {
    return this.commentsService.remove(id, req.user.id);
  }
}
