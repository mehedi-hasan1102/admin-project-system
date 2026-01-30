# Admin & Project Management System - Backend API

A production-ready backend REST API for enterprise-level project and resource management, built with Node.js, Express, TypeScript, and MongoDB.

**Version:** 1.0.0 | **Status:** Active Development

## 📋 Quick Navigation

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [API Reference](#-api-reference)
- [Authentication](#-authentication)
- [Role-Based Access Control](#-role-based-access-control)
- [Database Models](#-database-models)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Resources](#-resources)

---

## ✨ Features

### Security & Authentication
- **JWT-based Authentication** with access & refresh tokens
- **Password Security** - bcrypt hashing with 10 salt rounds
- **Role-Based Access Control (RBAC)** - 3 role levels with granular permissions
- **Input Validation** - Zod schemas for all API requests
- **Error Handling** - Custom error classes with structured error responses
- **Environment Validation** - Runtime verification of all configuration

### User Management
- Self-registration and OAuth-ready architecture
- Email-based invitation system with token verification
- User profile management and status tracking
- Admin capabilities for user lifecycle management
- Last login tracking and activity monitoring

### Project Management
- Full project lifecycle management
- Role-based team member assignment
- Hierarchical permissions (ADMIN, MANAGER, MEMBER)
- Soft deletion with audit trail
- Status tracking: ACTIVE, ARCHIVED, COMPLETED, ON_HOLD

### Collaboration
- Team member management with role-based access
- Project-scoped permissions
- Multi-level authorization checks
- Real-time collaboration ready (extensible)

### Task Management
- Comprehensive task tracking system
- Priority and status management
- Team member assignment and tracking
- Due date management and reminders
- Soft delete support for audit trails

## 🛠️ Tech Stack

| L🏗️ Architecture

### Directory Structure

```
src/
├── config/
│   ├── db.ts                    # MongoDB initialization
│   └── environment.ts           # Runtime configuration validation
├── models/
│   ├── User.ts                  # User schema with authentication fields
│   ├── Project.ts               # Project schema with team management
│   ├── Invite.ts                # Invitation schema
│   └── Task.ts                  # Task tracking schema
├── controllers/
│   ├── authController.ts        # Authentication endpoints
│   ├── userController.ts        # User management endpoints
│   └── projectController.ts     # Project management endpoints
├── routes/
│   ├── authRoutes.ts            # /api/auth routes
│   ├── userRoutes.ts            # /api/users routes
│   └── projectRoutes.ts         # /api/projects routes
├── middleware/
│   ├── authMiddleware.ts        # JWT verification & authorization
│   ├── errorHandler.ts          # Global error processing
│   └── validationMiddleware.ts  # Request schema validation
├── utils/
│   ├── password.ts              # Password hashing utilities
│   ├── jwt.ts                   # Token generation/verification
│   ├── errors.ts                # Custom error classes
│   ├── validators.ts            # Zod validation schemas
│   └── asyncHandler.ts          # Async error wrapper
├── app.ts                       # Express application
└── server.ts                    # Entry pointtilities
│   │   ├── jwt.ts               # JWT token generation/verification
│   │   ├── errors.ts            # Custom error classes
│   │   ├── validators.ts        # Zod validation schemas
│   │   └── asyncHandler.ts      # Error wrapping for async routes
│   ├── app.ts                   # Express app setup
│   └── server.ts                # Server entry point
├── package.json
├── tsconfig.json
├── .env                         # Environment variables
├── .gitignore
├── CODE_REVIEW.md              # Detailed code review
├── IMQuick Start

### System Requirements

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB:** 5.0+ (Atlas cloud or self-hosted)
- **Git:** For version control

### Installation

1. **Clone and navigate**
   ```bash
   git clone <repository-url>
   cd admin-project-system/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (see [Environment Setup](#environment-setup))
   ```bash
   cp .env.example .env
   nano .env  # Add your configuration values
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

### Build & Deploy

```bash
npm run build    # Transpile TypeScript → JavaScript
npm start        # Run production build
```

### Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run seed` | Seed database with sample data |```

### BuConfiguration

### Environment Variables

Create a `.env` file in the project root with the following:

```env
# Runtime Environment
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Security
JWT_SECRET=your-secret-key-at-least-32-characters-long
```

### Configuration Reference

| Variable | Required | Type | Default | Description |
|----------|----------|------|---------|-------------|
| `NODE_ENV` | ✅ | String | - | Execution environment: `development`, `production`, `test` |
| `PORT` | ✅ | Number | 5000 | Server listening port |
| `MONGODB_URI` | ✅ | String | - | MongoDB connection URI (Atlas or local) |
| `JWT_SECRET` | ✅ | String | - | Encryption key for JWT tokens (≥32 characters) |

### Validation Rules

- All environment variables are validated at startup using Zod schemas
- Invalid or missing variables will prevent server initialization
- ConnectiReference

### Base URL
```
http://localhost:5000
```

### Response Format

All API responses follow this structure:

```json
{
  "success": true/false,
  "message": "Operation description",
  "data": {}
}
```

### Authentication

#### POST `/api/auth/register`
Register new user account.

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### POST `/api/auth/login`
Authenticate and receive tokens.

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### GET `/api/auth/profile`
Get authenticated user profile. Requires `Authorization: Bearer <token>`

#### PUT `/api/auth/profile`
Update user profile. Requires authentication.

### User Management

### Authentication Flow

#### Self-Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
- Creates user with `STAFF` role
- Returns access & refresh tokens

#### Invite-Based Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "inviteToken": "invite-token-from-email"
}
```
- Creates user with invited role (ADMIN, MANAGER, or STAFF)
- Marks invitation as ACCEPTED

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
- Returns tokens on successful authentication
- Updates user's `lastLogin` timestamp

#### Using Tokens
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Token Specifications

| Property | Value |
|----------|-------|
| **Type** | JWT (JSON Web Token) |
| **Algorithm** | HS256 |
| **Access Token TTL** | 15 minutes |
| **Refresh Token TTL** | 7 days |
| **Signature** | HMAC using JWT_SECRET |

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*)
#### PUT `/api/projects/:projectId`
Update project information.
Authorization Hierarchy

| Role | Level | Capabilities |
|------|-------|--------------|
| **ADMIN** | 3 | System administration, user lifecycle, invite management, full project control |
| **MANAGER** | 2 | Project creation/management, team assignment, task delegation |
| **STAFF** | 1 | Project participation, task completion, collaboration |

### Permission Matrix

| Feature | ADMIN | MANAGER | STAFF |
|---------|-------|---------|-------|
| Create Invites | ✅ | ❌ | ❌ |
| Manage All Users | ✅ | ❌ | ❌ |
| Create Projects | ✅ | ✅ | ✅ |
| Delete Projects | ✅ | Own only | Own only |
| Assign Tasks | ✅ | ✅ | ❌ |
| Complete Tasks | ✅ | ✅ | ✅ |

### Implementation

```typescript
// ADMIN-only endpoint
router.post("/", authMiddleware, authorize(Role.ADMIN), handler);

// ADMIN or MANAGER
router.post("/", authMiddleware, authorize(Role.ADMIN, Role.MANAGER), handler);

// Any a Collection

```typescript
{
  _id: ObjectId,
  name: String,                    // Full name (2-100 chars)
  email: String,                   // Unique, indexed
  password: String,                // Bcrypt hashed
  role: "ADMIN" | "MANAGER" | "STAFF",  // Default: STAFF
  status: "ACTIVE" | "INACTIVE",   // Default: ACTIVE
  invitedAt?: Date,
  inviteToken?: String,
  inviteTokenExpiry?: Date,
  lastLogin?: Date,
  createdAt: Date,                 // Auto-generated
  updatedAt: Date                  // Auto-generated
}
```

### Project Collection

```typescript
{
  _id: ObjectId,
  name: String,                    // 3-100 chars
  description?: String,            // Max 500 chars
  status: ProjectStatus,           // ACTIVE | ARCHIVED | COMPLETED | ON_HOLD
  createdBy: ObjectId,             // Reference to User
  admin?: ObjectId,                // Project admin user
  teamMembers: [                   // Array of team assignments
    {
      userId: ObjectId,
      role: "ADMIN" | "MANAGER" | "MEMBER"
    }
  ],
  isDeleted: Boolean,              // Soft delete flag
  deletedAt?: Date,                // Soft delete timestamp
  createdAt: Date,
  updatedAt: Date
}
```

### Invite Collection

```typescript
{
  _id: ObjectId,
  email: String,                   // Invited email address
  invitedBy: ObjectId,             // Admin who sent invite
  role: "ADMIN" | "MANAGER" | "STAFF",
  status: InviteStatus,            // PENDING | ACCEPTED | DECLINED | REVOKED | EXPIRED
  expiresAt: Date,                 // Default: +7 days
  acceptedAt?: Date,
  acceptedBy?: ObjectId,           // User who accepted
  projectId?: ObjectId,            // Optional project reference
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection

```typescript
{
  _id: ObjectId,
  title: String,                   // 3-200 chars
  description?: String,            // Max 2000 chars
  projectId: ObjectId,             // Reference to Project
  assignedTo?: ObjectId,           // User assigned to task
  createdBy: ObjectId,             // Task creator
  status: TaskStatus,              // TODO | IN_PROGRESS | IN_REVIEW | DONE | BLOCKED
  priority: TaskPriority,          // LOW | MEDIUM | HIGH | URGENT
  dueDate?: Date,
  isDeleted: Boolean,              // Soft delete flag
  deletedAt?: Date,                // Soft delete timestamp
  createdAt: Date,

## Standard Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error details"
    }
  ]
}
```

### HTTP Status Codes

| Code | Type | Cause | Resolution |
|------|------|-------|-----------|
| 400 | Bad Request | Invalid input format or missing fields | Review request payload against schema |
| 401 | Unauthorized | Missing or invalid JWT token | Provide valid `Authorization: Bearer <token>` header |
| 403 | Forbidden | User lacks required permissions | Verify user role matches endpoint requirements |
| 404 | Not Found | Resource doesn't exist | Check resource ID and confirm record exists |
| 409 | Conflict | Unique constraint violation (e.g., duplicate email) | Use different value for unique field |
| 500 | Internal Server Error | Unexpected server error | Check server logs for details |

### Common Error Responses

**Validation Error**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Missing Token**
```json
{
  "success": false,
  "message": "No token provided"
}
```
Setup

1. Create new collection: `Admin System API`
2. Configure environment variables:
   - `baseUrl` = `http://localhost:5000`
   - `accessToken` = (auto-populate from login response)
   - `userId` = (auto-populate from profile response)

### Test Workflow

**1. Register User**
```http
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

**2. Login**
```http
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```
→ Save `accessToken` to environment variable

**3. Get Profile**
```http
GET {{baseUrl}}/api/auth/profile
Authorization: Bearer {{accessToken}}
```

**4. Coduction Checklist

- [ ] Compile TypeScript: `npm run build`
- [ ] Verify all environment variables
- [ ] Set `NODE_ENV=production`
- [ ] Install production dependencies only
- [ ] Configure MongoDB Atlas security
- [ ] Set up JWT_SECRET in production vault
- [ ] Enable CORS for frontend domain
- [ ] Configure SSL/TLS certificates

### Standard Deployment

```bash
# Prepare application
npm run build

# Install only production dependencies
npm install --production

# Start application
NODE_ENV=production npm start
```

### Process Management with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "admin-api" -- start

# Configure auto-restart
pm2 save
pm2 startup

# Monitor
pm2 logs admin-api
pm2 status
```

### Docker Containerization

**Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

**Build and Run**
```bash
# Build image
docker build -t admin-api:latest .
Database Connection Issues

**Symptom:** `MongoDB connection error`

**Solutions:**
- Verify `MONGODB_URI` format and credentials in `.env`
- Check MongoDB Atlas IP whitelist includes server IP
- Test connection with MongoDB Compass using connection string
- Confirm database user has appropriate roles
- Check network connectivity to MongoDB server

### Environment Configuration

**Symptom:** `Environment validation failed`

**Solutions:**
- Ensure all required variables are set (check error message)
- `JWT_SECRET` must be at least 32 characters
- Variable names are case-sensitive
- No spaces around `=` in `.env` file
- Run `npm run dev` to see detailed validation errors

### Authentication Issues

**Symptom:** `No token provided` (401)

**Solutions:**
- Add `Authorization` header to request
- Format: `Authorization: Bearer <token>`
- Remove "Bearer " prefix from token value
- Check token isn't malformed in request

**Symptom:** `Invalid token` (401)

**Solutions:**
- Access tokens expire after 15 minutes
- Us� Documentation

### Code Organization

**Naming Conventions**
- `camelCase` - Variables, functions, methods
- `PascalCase` - Classes, interfaces, enums
- `UPPER_SNAKE_CASE` - Constants, environment variables
- `kebab-case.ts` - Files (except model definitions)

**Code Patterns**
- Use TypeScript for complete type safety
- Follow async/await pattern (not .then())
- Wrap async routes with asyncHandler utility
- Use custom error classes for exceptions
- Keep controllers focused, extract business logic to services

### Adding New Features

```
1. Design schema in src/models/NewModel.ts
2. Create controller in src/controllers/newController.ts
3. Add validation in src/utils/validators.ts
4. Define routes in src/routes/newRoutes.ts
5. Register routes in src/app.ts
6. Add authorization checks to routes
7. Test all endpoints in Postman
```

### Project Philosophy

- **Separation of Concerns** - Models, controllers, middleware clearly separated
- **Type Safety** - Full TypeScript coverage
- **Error Handling** - Custom errors with meaningful messages
- **Security First** - Authentication, validation, authorization on all endpoints
- **Extensibility** - Architecture supports new features easily

---

## 🔗 Resources

| Resource | Link |
|----------|------|
| **Node.js** | https://nodejs.org/ |
| **Express.js** | https://expressjs.com/ |
| **TypeScript** | https://www.typescriptlang.org/ |
| **MongoDB** | https://docs.mongodb.com/ |
| **Mongoose** | https://mongoosejs.com/ |
| **JWT** | https://jwt.io/ |
| **Zod Validation** | https://zod.dev/ |
| **bcryptjs** | https://www.npmjs.com/package/bcryptjs |

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🆘 Support

### Common Issues

For detailed troubleshooting, see [Troubleshooting](#troubleshooting) section above.

### Getting Help

1. **Check logs** - Server logs contain detailed error messages
2. **Verify configuration** - Ensure all `.env` variables are set correctly
3. **Review error response** - API returns specific error codes and messages
4. **Test in isolation** - Use Postman to test endpoints individually
5. **Check permissions** - Verify user role matches endpoint requirements

### Reporting Issues

When reporting bugs, include:
- Error message and stack trace
- Endpoint being tested
- Request payload
- Server environment (development/production)
- Node.js and npm versions

---

**Built with ❤️ for efficient project management**

Version 1.0.0 | Last Updated: January 2026
### Postman Collection

1. Open Postman
2. Create collection "Admin System API"
3. Add environment variables:
   - `baseUrl`: http://localhost:5000
   - `accessToken`: (populated from login)
   - `userId`: (populated from login)

### Quick Test Steps

1. **Register**
   ```
   POST {{baseUrl}}/api/auth/register
   ```

2. **Login**
   ```
   POST {{baseUrl}}/api/auth/login
   Save accessToken from response
   ```

3. **Get Profile**
   ```
   GET {{baseUrl}}/api/auth/profile
   Header: Authorization: Bearer {{accessToken}}
   ```

4. **Create Project**
   ```
   POST {{baseUrl}}/api/projects
   Header: Authorization: Bearer {{accessToken}}
   ```

See **TESTING_GUIDE.md** for detailed Postman examples.

---

## 🚀 Deployment

### Prerequisites
- Node.js 18+ on server
- MongoDB Atlas (cloud) or MongoDB (self-hosted)
- Environment variables configured

### Steps

1. **Build application**
   ```bash
   npm run build
   ```

2. **Set production environment**
   ```bash
   NODE_ENV=production
   ```

3. **Install production dependencies only**
   ```bash
   npm install --production
   ```

4. **Start server**
   ```bash
   npm start
   ```

### Recommended: Using PM2

```bash
npm install -g pm2
pm2 start npm --name "admin-api" -- start
pm2 save
pm2 startup
```

### Docker Deployment (Optional)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

Build and run:
```bash
docker build -t admin-api .
docker run -p 5000:5000 --env-file .env admin-api
```

---

## 🔍 Troubleshooting

### "MongoDB connection error"
- Check MONGODB_URI in .env
- Ensure IP whitelist includes your server
- Test connection with MongoDB Compass

### "Environment validation failed"
- All required variables must be set
- JWT_SECRET must be min 32 characters
- Check exact variable names (case-sensitive)

### "No token provided"
- Add Authorization header: `Bearer <token>`
- Token format: `Authorization: Bearer eyJhbGc...`

### "Invalid token"
- Token may be expired (15 min for access token)
- Use refresh token to get new access token
- Verify token is from recent login

### "Insufficient permissions"
- User role doesn't match endpoint requirements
- Check user role in database
- Only ADMIN can create invites

### CORS Errors
- Frontend and backend must have matching CORS settings
- Update CORS in app.ts if needed:
  ```typescript
  app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
  }));
  ```

---

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow async/await pattern
- Use custom error classes
- Keep controllers thin, logic in services

### Naming Conventions
- Variables: camelCase
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case.ts (except models)

### Adding New Features

1. **Create model** in `src/models/`
2. **Create controller** in `src/controllers/`
3. **Create routes** in `src/routes/`
4. **Add validation schemas** in `src/utils/validators.ts`
5. **Register routes** in `src/app.ts`
6. **Test with Postman**

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Zod Validation](https://zod.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📄 License

MIT

---

## 👨‍💻 Support

For issues or questions:
1. Check TESTING_GUIDE.md
2. Review CODE_REVIEW.md
3. Check console logs and error messages
4. Verify environment variables

---

**Happy coding!** 🚀
