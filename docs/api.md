# API Documentation

Complete API reference with request/response examples.

**For architecture overview:** See [ARCHITECTURE.md](ARCHITECTURE.md)

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

**Note:** Port changed from 3001 to 3000 (2026-06-01)

## 📚 API Endpoints

### Authentication

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "johndoe"
}

Response: 200 OK
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Users

#### Get Current User Profile

```http
GET /users/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "bio": "Software developer",
  "avatar": "https://...",
  "followersCount": 10,
  "followingCount": 5,
  "articlesCount": 3
}
```

#### Update Profile

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "johndoe",
  "bio": "Updated bio",
  "avatar": "https://..."
}

Response: 200 OK
{ ... updated user ... }
```

#### Get User by Username

```http
GET /users/:username

Response: 200 OK
{ ... user data ... }
```

### Articles

#### Get All Articles

```http
GET /articles?page=1&limit=10&tag=javascript

Response: 200 OK
{
  "data": [
    {
      "id": "uuid",
      "title": "Article Title",
      "subtitle": "Subtitle",
      "content": "# Markdown content",
      "coverImage": "https://...",
      "viewCount": 100,
      "readingTime": 5,
      "published": true,
      "author": { ... },
      "tags": [ ... ],
      "clapsCount": 25,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### Create Article

```http
POST /articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Article",
  "subtitle": "A great story",
  "content": "# Introduction\n\nThis is my first article...",
  "coverImage": "https://...",
  "tags": ["javascript", "react"],
  "published": true
}

Response: 201 Created
{ ... article data ... }
```

#### Get Article by ID

```http
GET /articles/:id

Response: 200 OK
{ ... article data with comments ... }
```

#### Update Article

```http
PUT /articles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  ...
}

Response: 200 OK
{ ... updated article ... }
```

#### Delete Article

```http
DELETE /articles/:id
Authorization: Bearer <token>

Response: 200 OK
{ "message": "Article deleted successfully" }
```

#### Search Articles

```http
GET /articles/search?q=javascript&page=1&limit=10

Response: 200 OK
{ ... paginated search results ... }
```

#### Get User Feed

```http
GET /articles/feed?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{ ... articles from followed users ... }
```

#### Get User Articles

```http
GET /articles/user/:userId?page=1&limit=10

Response: 200 OK
{ ... user's articles ... }
```

### Comments

#### Get Article Comments

```http
GET /articles/:articleId/comments

Response: 200 OK
[
  {
    "id": "uuid",
    "content": "Great article!",
    "author": { ... },
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Create Comment

```http
POST /articles/:articleId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great article!"
}

Response: 201 Created
{ ... comment data ... }
```

#### Delete Comment

```http
DELETE /articles/:articleId/comments/:id
Authorization: Bearer <token>

Response: 200 OK
{ "message": "Comment deleted successfully" }
```

### Claps

#### Clap Article

```http
POST /articles/:articleId/claps
Authorization: Bearer <token>
Content-Type: application/json

{
  "count": 1
}

Response: 201 Created
{
  "id": "uuid",
  "count": 1,
  "userId": "uuid",
  "articleId": "uuid"
}
```

#### Get Article Claps

```http
GET /articles/:articleId/claps

Response: 200 OK
{
  "totalClaps": 150,
  "uniqueUsers": 45
}
```

#### Get User Claps for Article

```http
GET /articles/:articleId/claps/user
Authorization: Bearer <token>

Response: 200 OK
{
  "count": 5
}
```

### Bookmarks

#### Toggle Bookmark

```http
POST /bookmarks/articles/:articleId
Authorization: Bearer <token>

Response: 200 OK
{
  "bookmarked": true,
  "message": "Article bookmarked"
}
```

#### Get User Bookmarks

```http
GET /bookmarks?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{ ... paginated bookmarked articles ... }
```

#### Check Bookmark Status

```http
GET /bookmarks/articles/:articleId/check
Authorization: Bearer <token>

Response: 200 OK
{
  "bookmarked": true
}
```

### Follows

#### Toggle Follow

```http
POST /follows/users/:userId
Authorization: Bearer <token>

Response: 200 OK
{
  "following": true,
  "message": "Followed successfully"
}
```

#### Get User Followers

```http
GET /follows/users/:userId/followers

Response: 200 OK
[
  {
    "id": "uuid",
    "username": "follower1",
    ...
  }
]
```

#### Get User Following

```http
GET /follows/users/:userId/following

Response: 200 OK
[
  {
    "id": "uuid",
    "username": "following1",
    ...
  }
]
```

#### Check Following Status

```http
GET /follows/users/:userId/check
Authorization: Bearer <token>

Response: 200 OK
{
  "following": true
}
```

### Tags

#### Get All Tags

```http
GET /tags

Response: 200 OK
[
  {
    "id": "uuid",
    "name": "javascript",
    "articlesCount": 50
  }
]
```

#### Get Popular Tags

```http
GET /tags/popular?limit=10

Response: 200 OK
[ ... top tags ... ]
```

#### Get Tag Details

```http
GET /tags/:name

Response: 200 OK
{
  "id": "uuid",
  "name": "javascript",
  "articles": [ ... ]
}
```

### Upload

#### Upload Image

```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

[binary image data]

Response: 200 OK
{
  "url": "https://res.cloudinary.com/...",
  "message": "Image uploaded successfully"
}
```

## 🔐 Authentication

All protected endpoints require the `Authorization` header:

```http
Authorization: Bearer <jwt_token>
```

## ❌ Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "You can only edit your own articles",
  "error": "Forbidden"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Article not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

## 📊 Pagination

List endpoints support pagination:

```http
GET /articles?page=1&limit=10
```

Response includes metadata:

```json
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Testing with Swagger

Visit: `http://localhost:3000/api` (development only)

All endpoints are documented and can be tested directly from Swagger UI.

**Note:** Swagger is auto-disabled in production for security.

## 💡 Tips

1. Save JWT token after login/register
2. Include token in Authorization header for protected routes
3. Token expires after 7 days
4. Use pagination for large datasets
5. Check status codes for error handling
