import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Clap } from './clap.entity';
import { Bookmark } from './bookmark.entity';
import { Tag } from './tag.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  readingTime: number; // in minutes

  @Column({ default: true })
  published: boolean;

  @Column()
  authorId: string;

  @ManyToOne(() => User, user => user.articles, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @OneToMany(() => Comment, comment => comment.article)
  comments: Comment[];

  @OneToMany(() => Clap, clap => clap.article)
  claps: Clap[];

  @OneToMany(() => Bookmark, bookmark => bookmark.article)
  bookmarks: Bookmark[];

  @ManyToMany(() => Tag, tag => tag.articles)
  @JoinTable({
    name: 'article_tags',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
