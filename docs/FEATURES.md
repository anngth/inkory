# Inkory - Features Documentation

## ✨ Complete Features

### 🔐 Authentication & Authorization

- ✅ Email/Password registration
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ Automatic token refresh
- ✅ Secure password hashing (bcrypt)

### 📝 Article Management

- ✅ Create new articles with Markdown
- ✅ Live preview while writing
- ✅ Syntax highlighting for code blocks
- ✅ Upload cover image
- ✅ Auto-calculate reading time
- ✅ Draft/Published status
- ✅ Edit own articles
- ✅ Delete own articles
- ✅ View count tracking
- ✅ Rich text formatting with Markdown

### 👏 Engagement Features

- ✅ **Claps System** (Engagement feature)
  - Each user can clap up to 50 times per article
  - Real-time claps counter
  - Display user's clap count
- ✅ **Comments**
  - Write comments on articles
  - Display author and timestamp
  - Delete own comments
- ✅ **Bookmarks**
  - Save articles for later reading
  - Dedicated Bookmarks page
  - Easy bookmark toggle

### 👥 Social Features

- ✅ **Follow System**
  - Follow/Unfollow users
  - Display followers/following count
  - Check following status
- ✅ **User Profiles**
  - Customizable profile (avatar, bio, username)
  - Display user's articles
  - Stats (followers, following, articles)
- ✅ **Personalized Feed**
  - Feed from people you follow
  - Sorted by newest

### 🏷️ Content Organization

- ✅ **Tags System**
  - Add multiple tags to articles
  - Filter articles by tag
  - Popular tags sidebar
  - Tag pages
- ✅ **Search**
  - Full-text search
  - Search in title, subtitle, content
  - Search results with pagination

### 🖼️ Media Upload

- ✅ **Cloudinary Integration**
  - Upload avatar images
  - Upload cover images
  - Automatic optimization
  - CDN delivery
- ✅ **Image Handling**
  - Preview before upload
  - Validation (type, size)
  - Remove uploaded images

### 📊 Stats & Analytics

- ✅ View counts
- ✅ Reading time calculation
- ✅ Claps analytics
- ✅ Comment counts
- ✅ Follower stats

### 🎨 UI/UX Features

- ✅ **Responsive Design**
  - Mobile-friendly
  - Tablet optimized
  - Desktop full experience
- ✅ **Modern UI**
  - Clean, minimalist design
  - Smooth animations
  - Loading states
  - Empty states
- ✅ **Navigation**
  - Sticky header
  - Quick access buttons
  - Breadcrumbs
  - Back navigation

### 🔍 Content Discovery

- ✅ Home page with latest articles
- ✅ Personalized feed
- ✅ Tag-based discovery
- ✅ Search functionality
- ✅ Related articles (via tags)
- ✅ Popular tags

### ⚡ Performance

- ✅ Vite fast HMR
- ✅ API pagination
- ✅ Lazy loading
- ✅ Image optimization
- ✅ Code splitting

### 🛡️ Security

- ✅ JWT token authentication
- ✅ Password hashing
- ✅ CORS configuration
- ✅ Input validation
- ✅ XSS protection
- ✅ SQL injection prevention (TypeORM)

### 📱 Pages

#### Public Pages:

- `/` - Home (latest articles)
- `/login` - Login page
- `/register` - Registration page
- `/article/[id]` - Article detail page
- `/profile/[username]` - User profile page
- `/tag/[name]` - Tag page
- `/search` - Search page

#### Protected Pages (require login):

- `/write` - Create new article
- `/article/[id]/edit` - Edit article
- `/feed` - Personalized feed
- `/bookmarks` - Saved articles
- `/settings` - User settings

### 🔧 Technical Stack

#### Backend:

- **Framework**: NestJS 10.x
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **API Docs**: Swagger/OpenAPI
- **File Upload**: Cloudinary

#### Frontend:

- **Framework**: Vite + React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Markdown**: react-markdown + remark-gfm
- **Code Highlighting**: react-syntax-highlighter
- **Icons**: Lucide React

### 📐 Architecture

#### Backend Structure:

```
backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── users/          # User management
│   ├── articles/       # Article CRUD
│   ├── comments/       # Comments system
│   ├── claps/          # Claps feature
│   ├── bookmarks/      # Bookmarks feature
│   ├── follows/        # Follow system
│   ├── tags/           # Tags management
│   ├── upload/         # File upload
│   ├── entities/       # Database entities
│   ├── config/         # Configuration
│   └── main.ts         # Entry point
```

#### Frontend Structure:

```
frontend/
├── src/                # Source files
├── components/         # Reusable components
├── lib/               # Utilities & API client
├── store/             # Zustand state
└── types/             # TypeScript types
```

### 🎯 User Flows

#### New User:

1. Visit homepage → View articles
2. Click "Get started" → Register
3. Login → Redirected to home
4. Click "Write" → Create first article
5. Publish → Article appears in feed

#### Reader:

1. Browse home/feed
2. Click article → Read
3. Clap if liked
4. Leave comment
5. Bookmark to read later
6. Follow author

#### Writer:

1. Click "Write"
2. Add title, content (Markdown)
3. Upload cover image
4. Add tags
5. Publish or save as draft
6. Share link

### 🚀 Scalability Features

- Pagination on all list endpoints
- Efficient database queries with relations
- Index on frequently queried fields
- CDN for images (Cloudinary)
- Stateless JWT authentication
- RESTful API design

### 🎨 Design Principles

- Clean, minimalist interface
- Typography-focused design
- Generous whitespace
- Clear visual hierarchy
- Intuitive navigation
- Consistent color scheme
- Smooth transitions
- Accessible UI elements

### 📈 Future Enhancements (Ideas)

- [ ] Article series/collections
- [ ] Reading lists
- [ ] Email notifications
- [ ] Social sharing buttons
- [ ] Article drafts autosave
- [ ] Collaborative writing
- [ ] Article revisions history
- [ ] Admin dashboard
- [ ] Content moderation
- [ ] Analytics dashboard
- [ ] Newsletter feature
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Mobile apps

## 🎉 Summary

Inkory is a modern, full-featured blogging platform with all the main features for writers and readers.
