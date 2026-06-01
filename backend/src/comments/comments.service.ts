import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { Article } from "../entities/article.entity";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(
    articleId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException("Article not found");
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      articleId,
      authorId: userId,
    });

    return this.commentRepository.save(comment);
  }

  async findByArticle(articleId: string) {
    return this.commentRepository
      .createQueryBuilder("comment")
      .leftJoin("comment.author", "author")
      .addSelect([
        "author.id",
        "author.username",
        "author.avatar",
        "author.bio",
      ])
      .where("comment.articleId = :articleId", { articleId })
      .orderBy("comment.createdAt", "DESC")
      .getMany();
  }

  async remove(id: string, userId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException("Comment not found");
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException("You can only delete your own comments");
    }

    await this.commentRepository.remove(comment);

    return { message: "Comment deleted successfully" };
  }
}
