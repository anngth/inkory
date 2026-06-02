import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Article } from './article.entity';
import { Comment } from './comment.entity';
import { Clap } from './clap.entity';
import { Bookmark } from './bookmark.entity';
import { Follow } from './follow.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Article, article => article.author)
  articles: Article[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @OneToMany(() => Clap, clap => clap.user)
  claps: Clap[];

  @OneToMany(() => Bookmark, bookmark => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => Follow, follow => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, follow => follow.following)
  followers: Follow[];
}
