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
      .addSelect(
        subQuery =>
          subQuery
            .select('COUNT(article_tag.articleId)', 'count')
            .from('article_tags_tag', 'article_tag')
            .where('article_tag.tagId = tag.id'),
        'articlesCount',
      )
      .orderBy('tag.name', 'ASC')
      .getRawAndEntities();

    return tags.entities.map((tag, index) => ({
      ...tag,
      articlesCount: parseInt(tags.raw[index]?.articlesCount) || 0,
    }));
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

    // Step 1: Get paginated distinct article IDs
    const articleIdsQuery = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.tags', 'tag')
      .where('tag.id = :tagId', { tagId: tag.id })
      .andWhere('article.published = :published', { published: true })
      .select('article.id')
      .distinct(true)
      .orderBy('article.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const articleIdsResult = await articleIdsQuery.getRawMany();
    const articleIds = articleIdsResult.map(row => row.article_id);

    // Get total count using the same base filter
    const total = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.tags', 'tag')
      .where('tag.id = :tagId', { tagId: tag.id })
      .andWhere('article.published = :published', { published: true })
      .getCount();

    // If no articles found, return early
    if (articleIds.length === 0) {
      return {
        ...tag,
        articles: [],
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    // Step 2: Fetch full article data with aggregated relations
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.author', 'author')
      .addSelect([
        'author.id',
        'author.username',
        'author.avatar',
        'author.bio',
      ])
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoin('article.claps', 'claps')
      .addSelect('COALESCE(SUM(claps.count), 0)', 'clapsCount')
      .where('article.id IN (:...ids)', { ids: articleIds })
      .groupBy('article.id')
      .addGroupBy('author.id')
      .addGroupBy('tags.id')
      .orderBy('article.createdAt', 'DESC');

    const articlesResult = await queryBuilder.getRawAndEntities();

    // Build a lookup map from raw results keyed by article ID
    // Raw results contain one row per article×tag combination due to groupBy
    const clapsLookup = new Map<string, number>();
    articlesResult.raw.forEach(row => {
      const articleId = row.article_id;
      if (articleId && !clapsLookup.has(articleId)) {
        clapsLookup.set(articleId, parseInt(row.clapsCount) || 0);
      }
    });

    // Map clapsCount using the lookup instead of raw array index
    const articles = articlesResult.entities.map(article => ({
      ...article,
      clapsCount: clapsLookup.get(article.id) || 0,
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
