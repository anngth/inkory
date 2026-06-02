import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity('claps')
@Unique(['userId', 'articleId'])
export class Clap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 1 })
  count: number;

  @Column()
  userId: string;

  @Column()
  articleId: string;

  @ManyToOne(() => User, user => user.claps)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Article, article => article.claps)
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @CreateDateColumn()
  createdAt: Date;
}
