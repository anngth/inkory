import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { Article } from '../entities/article.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async findAll() {
    const tags = await this.tagRepository
      .createQueryBuilder('tag')
      .loadRelationCountAndMap('tag.articlesCount', 'tag.articles')
      .orderBy('tag.name', 'ASC')
      .getMany();

    return tags;
  }

  async findPopular(limit = 10) {
    // Clamp limit to max 50
    const safeLimit = Math.min(Math.max(limit, 1), 50);

    const tags = await this.tagRepository
      .createQueryBuilder('tag')
      .leftJoin('tag.articles', 'article')
      .addSelect('COUNT(article.id)', 'articleCount')
      .groupBy('tag.id')
      .orderBy('articleCount', 'DESC')
      .limit(safeLimit)
      .getMany();

    return tags;
  }

  async findOne(name: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const tag = await this.tagRepository.findOne({
      where: { name: name.toLowerCase() },
    });

    if (!tag) {
      return null;
    }

    // Query articles from articleRepository with proper pagination
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.tags', 'tag')
      .leftJoin('article.author', 'author')
      .addSelect(['author.id', 'author.username', 'author.avatar', 'author.bio'])
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoin('article.claps', 'claps')
      .addSelect('COALESCE(SUM(claps.count), 0)', 'clapsCount')
      .where('tag.id = :tagId', { tagId: tag.id })
      .andWhere('article.published = :published', { published: true })
      .groupBy('article.id')
      .addGroupBy('author.id')
      .addGroupBy('tags.id')
      .orderBy('article.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const articlesResult = await queryBuilder.getRawAndEntities();

    const total = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.tags', 'tag')
      .where('tag.id = :tagId', { tagId: tag.id })
      .andWhere('article.published = :published', { published: true })
      .getCount();

    const articles = articlesResult.entities.map((article, index) => ({
      ...article,
      clapsCount: parseInt(articlesResult.raw[index]?.clapsCount) || 0,
    }));

    return {
      ...tag,
      articles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
