# Architecture

## Tech Stack

```text
Frontend (Vite)
├── Framework: Vite + React 19
├── Routing: React Router 6
├── State: Zustand
├── Styling: TailwindCSS
├── API: Axios
└── Port: 5173

Backend (NestJS 10)
├── Framework: NestJS 10.4
├── Database: PostgreSQL + TypeORM 0.3
├── Auth: JWT + Passport
├── Upload: Cloudinary
├── Docs: Swagger (dev only)
└── Port: 3000
```

## Database Schema

### Users

```sql
id          UUID PRIMARY KEY
email       VARCHAR UNIQUE NOT NULL
password    VARCHAR NOT NULL  -- bcrypt hashed
username    VARCHAR NOT NULL
bio         TEXT
avatar      VARCHAR
createdAt   TIMESTAMP
updatedAt   TIMESTAMP
```

### Articles

```sql
id          UUID PRIMARY KEY
title       VARCHAR NOT NULL
subtitle    VARCHAR
content     TEXT NOT NULL
coverImage  VARCHAR
published   BOOLEAN DEFAULT false
viewCount   INTEGER DEFAULT 0
readingTime INTEGER  -- minutes
authorId    UUID REFERENCES users(id)
createdAt   TIMESTAMP
updatedAt   TIMESTAMP
```

### Comments

```sql
id          UUID PRIMARY KEY
content     TEXT NOT NULL
articleId   UUID REFERENCES articles(id)
authorId    UUID REFERENCES users(id)
createdAt   TIMESTAMP
```

### Claps

```sql
id          UUID PRIMARY KEY
count       INTEGER DEFAULT 1  -- User can clap multiple times
userId      UUID REFERENCES users(id)
articleId   UUID REFERENCES articles(id)
createdAt   TIMESTAMP
UNIQUE(userId, articleId)
```

### Bookmarks

```sql
id          UUID PRIMARY KEY
userId      UUID REFERENCES users(id)
articleId   UUID REFERENCES articles(id)
createdAt   TIMESTAMP
UNIQUE(userId, articleId)
```

### Follows

```sql
id          UUID PRIMARY KEY
followerId  UUID REFERENCES users(id)
followingId UUID REFERENCES users(id)
createdAt   TIMESTAMP
UNIQUE(followerId, followingId)
```

### Tags

```sql
id          UUID PRIMARY KEY
name        VARCHAR UNIQUE NOT NULL
```

### Article_Tags (Many-to-Many)

```sql
articleId   UUID REFERENCES articles(id)
tagId       UUID REFERENCES tags(id)
PRIMARY KEY(articleId, tagId)
```

## API Endpoints

### Public Endpoints

#### Articles

```http
GET  /articles?page=1&limit=10&tag=javascript
     → List published articles (paginated, max 50/page)

GET  /articles/search?q=query&page=1&limit=10
     → Search articles (query: 2-100 chars)

GET  /articles/:id
     → Get single article (increments viewCount atomically)

GET  /articles/user/:userId?page=1&limit=10
     → Get user's articles
```

#### Tags

```http
GET  /tags
     → List all tags with article counts

GET  /tags/popular?limit=10
     → Popular tags (max 50)

GET  /tags/:name?page=1&limit=10
     → Get tag with articles (paginated)
```

#### Users

```http
GET  /users/:username
     → Public profile (no email/password)
     → Returns: id, username, bio, avatar, counts
```

#### Auth

```http
POST /auth/register
     Body: {email, password, username}
     → Register new user

POST /auth/login
     Body: {email, password}
     → Login, returns JWT token
```

### Protected Endpoints (JWT Required)

#### Articles

```http
POST   /articles
       Body: {title, subtitle, content, coverImage, published, tags[]}
       → Create article

PUT    /articles/:id
       Body: {title?, subtitle?, content?, coverImage?, published?, tags[]?}
       → Update own article

DELETE /articles/:id
       → Delete own article

GET    /articles/feed?page=1&limit=10
       → Get articles from followed users
```

#### Claps

```http
POST   /articles/:id/clap
       → Add clap (increments count if already clapped)

DELETE /articles/:id/clap
       → Remove all claps from user
```

#### Bookmarks

```http
POST   /articles/:id/bookmark
       → Bookmark article

DELETE /articles/:id/bookmark
       → Remove bookmark

GET    /bookmarks?page=1&limit=10
       → Get user's bookmarks
```

#### Comments

```http
POST   /articles/:id/comments
       Body: {content}
       → Add comment

GET    /articles/:id/comments
       → Get article comments

DELETE /comments/:id
       → Delete own comment
```

#### Follows

```http
POST   /follows/:userId
       → Follow user

DELETE /follows/:userId
       → Unfollow user

GET    /follows/followers
       → Get user's followers

GET    /follows/following
       → Get users being followed
```

#### Users

```http
GET  /users/profile
     → Get own profile (includes email)

PUT  /users/profile
     Body: {username?, bio?, avatar?}
     → Update own profile
```

#### Upload

```http
POST /upload/image
     Form: image file (max 5MB, JPEG/PNG/GIF/WebP)
     → Upload image to Cloudinary
     → Returns: {url}
```

## Key Patterns

### Query Pattern: User Relations

```typescript
// Always use explicit select to prevent password/email exposure
.leftJoin('article.author', 'author')
.addSelect(['author.id', 'author.username', 'author.avatar', 'author.bio'])
```

### Query Pattern: Claps Count

```typescript
// Use SUM(count) not COUNT(*) because Clap.count can be > 1
.leftJoin('article.claps', 'claps')
.addSelect('COALESCE(SUM(claps.count), 0)', 'clapsCount')
.groupBy('article.id')
```

### Query Pattern: Atomic Updates

```typescript
// Use atomic operations for counters
await repository.increment({ id }, "viewCount", 1);
```

### Query Pattern: Pagination

```typescript
// Always validate and limit pagination
@Query() query: PaginationQueryDto  // max 50, min 1
```

### Validation Pattern

```typescript
// All DTOs use class-validator
export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;
}
```

## Security Implementation

### Password Protection

- Passwords hashed with bcrypt (cost 10)
- Never returned in API responses
- All user relations use explicit field selection

### JWT Authentication

- Secret min 32 chars (validated on startup)
- Default expiration: 7 days
- Stored in localStorage (frontend)
- Sent via Authorization: Bearer header

### Input Validation

- All endpoints use validated DTOs
- Pagination: max 50 items
- Search: 2-100 chars, trimmed
- File upload: 5MB max, magic bytes validated

### File Upload Security

- Size limit enforced BEFORE memory load
- MIME type validated in fileFilter
- Magic bytes validated after upload
- Supported: JPEG, PNG, GIF, WebP (full signature check)

### CORS

- Configured for frontend origin
- Credentials enabled
- Production: Set FRONTEND_URL env var

### Swagger

- Enabled in development
- Auto-disabled in production (NODE_ENV=production)
- Can override with ENABLE_SWAGGER=true

## Data Flow

### Article Creation

```text
1. User submits article form (frontend)
2. POST /articles with JWT token
3. JwtAuthGuard validates token
4. CreateArticleDto validates input
5. Calculate reading time (200 words/min)
6. Process tags (create if new)
7. Save article to database
8. Return article with author info (no password)
```

### Article View

```text
1. User clicks article (frontend)
2. GET /articles/:id (no auth required)
3. Load article with relations (author, tags)
4. Aggregate claps count (SUM not COUNT)
5. Count comments
6. Increment viewCount atomically
7. Return article data
```

### Clap System

```text
1. User claps article (frontend)
2. POST /articles/:id/clap with JWT
3. Find existing clap (userId + articleId)
4. If exists: increment count
5. If not: create with count=1
6. Return updated clap
7. Frontend refetches article to show new count
```

## Performance Considerations

### Database Queries

- Use explicit field selection (avoid SELECT \*)
- Use aggregations (SUM, COUNT) in SQL not JS
- Use atomic operations for updates
- Add indexes on foreign keys
- Paginate all list queries

### Response Size

- Exclude sensitive fields (password, email)
- Don't load unnecessary relations
- Use pagination (max 50 items)
- Aggregate counts instead of loading entities

### Caching Strategy

- Frontend: Cache API responses in Zustand
- Backend: No caching yet (add Redis if needed)
- Database: Use query result cache for heavy queries

## Error Handling

### Backend

```typescript
// NestJS built-in exceptions
throw new NotFoundException("Article not found");
throw new ForbiddenException("Not your article");
throw new BadRequestException("Invalid input");
throw new UnauthorizedException("Invalid token");
```

### Frontend

```typescript
// Axios interceptor handles errors
try {
  const response = await api.get("/articles");
} catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  }
  // Show error message
}
```

## Testing Strategy

### Backend

- Unit tests: Services and utilities
- E2E tests: API endpoints
- Security tests: Automated script

### Frontend

- Component tests: React Testing Library
- E2E tests: Playwright (if needed)
- Manual testing: User flows

## Deployment Architecture

```text
Production:
├── Frontend: Vercel/Netlify (static)
├── Backend: Railway/Render (container)
├── Database: Railway/Render (PostgreSQL)
└── Storage: Cloudinary (images)

Development:
├── Frontend: localhost:5173
├── Backend: localhost:3000
└── Database: localhost:5432
```

## Next Steps

- **Setup locally:** [setup.md](setup.md)
- **Review security:** [security.md](security.md)
- **Deploy:** [deployment.md](deployment.md)
- **Troubleshoot:** [troubleshooting.md](troubleshooting.md)
