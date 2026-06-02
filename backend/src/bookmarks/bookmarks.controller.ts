import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('bookmarks')
@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  @Post('articles/:articleId')
  @ApiOperation({ summary: 'Toggle bookmark for an article' })
  async toggle(@Param('articleId') articleId: string, @Request() req) {
    return this.bookmarksService.toggle(articleId, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get user bookmarks' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getUserBookmarks(
    @Request() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.bookmarksService.getUserBookmarks(req.user.id, page, limit);
  }

  @Get('articles/:articleId/check')
  @ApiOperation({ summary: 'Check if article is bookmarked' })
  async checkBookmark(@Param('articleId') articleId: string, @Request() req) {
    return this.bookmarksService.checkBookmark(articleId, req.user.id);
  }
}
