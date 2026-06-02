import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity('bookmarks')
@Unique(['userId', 'articleId'])
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  articleId: string;

  @ManyToOne(() => User, user => user.bookmarks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Article, article => article.bookmarks)
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @CreateDateColumn()
  createdAt: Date;
}
