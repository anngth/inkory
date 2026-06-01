# Contributing to Inkory

Thank you for your interest in contributing to Inkory! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

---

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/inkory.git`
3. Add upstream: `git remote add upstream https://github.com/original/inkory.git`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

---

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Git

### Setup Instructions

```bash
# Install dependencies
npm install

# Backend setup
cd backend
npm install
cp .env.example .env
npm run start:dev

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

---

## Coding Standards

### TypeScript

- Use strict mode: `"strict": true`
- Avoid `any` types
- Use interfaces for object types
- Add JSDoc comments for public functions

### Backend (NestJS)

- Follow NestJS module structure
- Use dependency injection
- Add validation with class-validator
- Write unit tests for services

### Frontend

- Use functional components
- Follow React hooks best practices
- Use TypeScript for type safety
- Keep components small and focused

### Code Style

- Use Prettier for formatting
- Use ESLint for linting
- Max line length: 100 characters
- Use meaningful variable names

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Tests
- `chore`: Build, dependencies

### Examples

```
feat(auth): add two-factor authentication
fix(articles): resolve markdown rendering issue
docs(setup): update installation guide
```

---

## Pull Request Process

1. **Update your branch**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**

   ```bash
   npm run test
   npm run lint
   ```

3. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Use descriptive title
   - Reference related issues
   - Describe changes clearly
   - Add screenshots if UI changes

5. **Code Review**
   - Address feedback promptly
   - Keep commits clean
   - Respond to comments

6. **Merge**
   - Maintainers will merge when approved
   - Squash commits if needed

---

## Testing

### Backend Tests

```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend
npm run test
```

---

## Documentation

- Update docs for new features
- Keep README.md current
- Add comments for complex logic
- Update API documentation

---

## Questions?

- Check [docs/](./docs/) for detailed guides
- Open an issue for questions
- Join our community discussions

---

**Thank you for contributing to Inkory! 🎉**
