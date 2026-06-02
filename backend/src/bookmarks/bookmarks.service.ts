import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../entities/bookmark.entity';
import { Article } from '../entities/article.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async toggle(articleId: string, userId: string) {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const existingBookmark = await this.bookmarkRepository.findOne({
      where: { articleId, userId },
    });

    if (existingBookmark) {
      // Remove bookmark
      await this.bookmarkRepository.remove(existingBookmark);
      return { bookmarked: false, message: 'Bookmark removed' };
    } else {
      // Add bookmark
      const bookmark = this.bookmarkRepository.create({
        articleId,
        userId,
      });
      await this.bookmarkRepository.save(bookmark);
      return { bookmarked: true, message: 'Article bookmarked' };
    }
  }

  async getUserBookmarks(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await this.bookmarkRepository.findAndCount({
      where: { userId },
      relations: {
        article: {
          author: true,
          tags: true,
        },
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: bookmarks.map(bookmark => bookmark.article),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async checkBookmark(articleId: string, userId: string) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { articleId, userId },
    });

    return { bookmarked: !!bookmark };
  }
}
