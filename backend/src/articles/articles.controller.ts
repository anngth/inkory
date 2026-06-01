import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { SearchQueryDto } from "../common/dto/search-query.dto";

@ApiTags("articles")
@Controller("articles")
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new article" })
  async create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(req.user.id, createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all published articles" })
  async findAll(
    @Query() query: PaginationQueryDto,
    @Query("tag") tag?: string,
  ) {
    return this.articlesService.findAll(query.page, query.limit, tag);
  }

  @Get("search")
  @ApiOperation({ summary: "Search articles" })
  async search(@Query() query: SearchQueryDto) {
    return this.articlesService.search(query.q, query.page, query.limit);
  }

  @Get("feed")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get personalized feed from followed users" })
  async getFeed(@Request() req, @Query() query: PaginationQueryDto) {
    return this.articlesService.getFeed(req.user.id, query.page, query.limit);
  }

  @Get("user/:userId")
  @ApiOperation({ summary: "Get articles by user" })
  async getUserArticles(
    @Param("userId") userId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.articlesService.getUserArticles(
      userId,
      query.page,
      query.limit,
    );
  }

  @Get(":id")
  @ApiOperation({ summary: "Get article by ID" })
  async findOne(@Param("id") id: string) {
    return this.articlesService.findOne(id);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update article" })
  async update(
    @Param("id") id: string,
    @Request() req,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, req.user.id, updateArticleDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete article" })
  async remove(@Param("id") id: string, @Request() req) {
    return this.articlesService.remove(id, req.user.id);
  }
}
