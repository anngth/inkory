import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { PopularTagsQueryDto } from '../common/dto/popular-tags-query.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  async findAll() {
    return this.tagsService.findAll();
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular tags' })
  async findPopular(@Query() query: PopularTagsQueryDto) {
    return this.tagsService.findPopular(query.limit);
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get tag by name with articles' })
  async findOne(
    @Param('name') name: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.tagsService.findOne(name, query.page, query.limit);
  }
}
