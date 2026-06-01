export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  followersCount?: number;
  followingCount?: number;
  articlesCount?: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  coverImage?: string;
  viewCount: number;
  readingTime: number;
  published: boolean;
  authorId: string;
  author: User;
  tags?: Tag[];
  claps?: Clap[];
  clapsCount?: number;
  comments?: Comment[];
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  articleId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  articlesCount?: number;
  createdAt: string;
}

export interface Clap {
  id: string;
  count: number;
  userId: string;
  articleId: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
