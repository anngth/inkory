import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Tag } from '../entities/tag.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(userId: string, createArticleDto: CreateArticleDto) {
    const { tags: tagNames, ...articleData } = createArticleDto;

    // Calculate reading time (average 200 words per minute)
    const wordCount = articleData.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const article = this.articleRepository.create({
      ...articleData,
      authorId: userId,
      readingTime,
    });

    // Handle tags
    if (tagNames && tagNames.length > 0) {
      const tags = await Promise.all(
        tagNames.map(async (tagName) => {
          let tag = await this.tagRepository.findOne({
            where: { name: tagName.toLowerCase() },
          });

          if (!tag) {
            tag = this.tagRepository.create({ name: tagName.toLowerCase() });
            await this.tagRepository.save(tag);
          }

          return tag;
        }),
      );

      article.tags = tags;
    }

    return this.articleRepository.save(article);
  }

  async findAll(page = 1, limit = 10, tag?: string) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.author', 'author')
      .addSelect(['author.id', 'author.username', 'author.avatar', 'author.bio'])
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoin('article.claps', 'claps')
      .addSelect('COALESCE(SUM(claps.count), 0)', 'clapsCount')
      .where('article.published = :published', { published: true })
      .groupBy('article.id')
      .addGroupBy('author.id')
      .addGroupBy('tags.id')
      .orderBy('article.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (tag) {
      queryBuilder.andWhere('tags.name = :tag', { tag: tag.toLowerCase() });
    }

    const articles = await queryBuilder.getRawAndEntities();

    // Get total count separately (without groupBy)
    const countQuery = this.articleRepository
      .createQueryBuilder('article')
      .where('article.published = :published', { published: true });

    if (tag) {
      countQuery
        .leftJoin('article.tags', 'tags')
        .andWhere('tags.name = :tag', { tag: tag.toLowerCase() });
    }

    const total = await countQuery.getCount();

    // Map clapsCount from raw results to entities
    const data = articles.entities.map((article, index) => ({
      ...article,
      clapsCount: parseInt(articles.raw[index]?.clapsCount) || 0,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.author', 'author')
      .addSelect(['author.id', 'author.username', 'author.avatar', 'author.bio'])
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoin('article.claps', 'claps')
      .addSelect('COALESCE(SUM(claps.count), 0)', 'clapsCount')
      .loadRelationCountAndMap('article.commentsCount', 'article.comments')
      .where('article.id = :id', { id })
      .groupBy('article.id')
      .addGroupBy('author.id')
      .addGroupBy('tags.id')
      .getRawAndEntities();

    if (!article.entities[0]) {
      throw new NotFoundException('Article not found');
    }

    // Increment view count atomically
    await this.articleRepository.increment({ id }, 'viewCount', 1);

    return {
      ...article.entities[0],
      clapsCount: parseInt(article.raw[0]?.clapsCount) || 0,
    };
  }

  async update(
    id: string,
    userId: string,
    updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.authorId !== userId) {
      throw new ForbiddenException('You can only update your own articles');
    }

    const { tags: tagNames, ...articleData } = updateArticleDto;

    // Update reading time if content changed
    if (articleData.content) {
      const wordCount = articleData.content.split(/\s+/).length;
      articleData['readingTime'] = Math.ceil(wordCount / 200);
    }

    Object.assign(article, articleData);

    // Handle tags update
    if (tagNames) {
      const tags = await Promise.all(
        tagNames.map(async (tagName) => {
          let tag = await this.tagRepository.findOne({
            where: { name: tagName.toLowerCase() },
          });

          if (!tag) {
            tag = this.tagRepository.create({ name: tagName.toLowerCase() });
            await this.tagRepository.save(tag);
          }

          return tag;
        }),
      );

      article.tags = tags;
    }

    return this.articleRepository.save(article);
  }

  async remove(id: string, userId: string) {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own articles');
    }

    await this.articleRepository.remove(article);

    return { message: 'Article deleted successfully' };
  }

  async getUserArticles(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.author', 'author')
      .addSelect(['author.id', 'author.username', 'author.avatar', 'author.bio'])
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoin('article.claps', 'claps')
      .addSelect('COALESCE(SUM(claps.count), 0)', 'clapsCount')
      .where('article.authorId = :userId', { userId })
      .groupBy('article.id')
      .addGroupBy('author.id')
      .addGroupBy('tags.id')
      .orderBy('article.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const articles = await queryBuilder.getRawAndEntities();

    const total = await this.articleRepository.count({
      where: { authorId: userId },
    });

    const data = articles.entities.map((article, index) => ({
      ...article,
      clapsCount: parseInt(articles.raw[index]?.clapsCount) || 0,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async search(query: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.author', 'author')
      .addSelect(['author.id', 'author.username', 'author.avatar', 'author.bio'])
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoin('article.claps', 'claps')
      .addSelect('COALESCE(SUM(claps.count), 0)', 'clapsCount')
      .where('article.published = :published', { published: true })
      .andWhere(
        '(article.title ILIKE :query OR article.subtitle ILIKE :query OR article.content ILIKE :query)',
        { query: `%${query}%` },
      )
      .groupBy('article.id')
      .addGroupBy('author.id')
      .addGroupBy('tags.id')
      .orderBy('article.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const articles = await queryBuilder.getRawAndEntities();

    const countQuery = this.articleRepository
      .createQueryBuilder('article')
      .where('article.published = :published', { published: true })
      .andWhere(
        '(article.title ILIKE :query OR article.subtitle ILIKE :query OR article.content ILIKE :query)',
        { query: `%${query}%` },
      );

    const total = await countQuery.getCount();

    const data = articles.entities.map((article, index) => ({
      ...article,
      clapsCount: parseInt(articles.raw[index]?.clapsCount) || 0,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFeed(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.author', 'author')
      .addSelect(['author.id', 'author.username', 'author.avatar', 'author.bio'])
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoin('article.claps', 'claps')
      .addSelect('COALESCE(SUM(claps.count), 0)', 'clapsCount')
      .leftJoin('author.followers', 'follow')
      .where('follow.followerId = :userId', { userId })
      .andWhere('article.published = :published', { published: true })
      .groupBy('article.id')
      .addGroupBy('author.id')
      .addGroupBy('tags.id')
      .orderBy('article.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const articles = await queryBuilder.getRawAndEntities();

    const countQuery = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.author', 'author')
      .leftJoin('author.followers', 'follow')
      .where('follow.followerId = :userId', { userId })
      .andWhere('article.published = :published', { published: true });

    const total = await countQuery.getCount();

    const data = articles.entities.map((article, index) => ({
      ...article,
      clapsCount: parseInt(articles.raw[index]?.clapsCount) || 0,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
