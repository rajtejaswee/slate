<div align="center">

<img src="https://img.shields.io/badge/Slate-Collaborative%20Canvas-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0zIDNsMTggMThNMyAyMUwyMSAzIi8+PC9zdmc+" alt="Slate Banner" />

# Slate

### Real-Time Collaborative Infinite Canvas & Diagramming App

A production-grade platform for visual brainstorming. Instantly create a room, share a link, and draw with your team — all synced in real time.


[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-00C851?style=for-the-badge)](https://slate-web-murex.vercel.app/)

</div>

---

## What is Slate?

Slate eliminates fragmented communication during remote collaboration. Traditional tools require setup, logins, and context-switching. Slate gives you a **zero-friction infinite canvas** — click "Create Canvas," share the link, and your team is drawing together within seconds with sub-second sync.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖊️ **Infinite Canvas** | Hardware-accelerated drawing engine powered by Rough.js for a natural, sketch-like feel |
| ⚡ **Real-Time Sync** | Sub-second state broadcasting to all clients in a room via WebSockets |
| 🔐 **OAuth + Credentials** | Sign in with Google, GitHub, or standard email/password |
| 🗂️ **Persistent Rooms** | Unique URL slugs (`/canvas/room-[slug]`) that retain full canvas state across sessions |
| 👑 **Role-Based Access** | Room ownership tracked via `adminId` for access control |
| 🔄 **Auto-Reconnect** | Graceful WebSocket drop handling with automatic reconnection — zero interruption to your view |

---

## 🏗️ Architecture

Slate is built on a **decoupled microservices monorepo** managed with Turborepo. Each concern is isolated for independent scaling.

```
slate/
├── apps/
│   ├── web/               # Next.js 14 Frontend (App Router)
│   ├── http-backend/      # Express REST API (Auth, Rooms, History)
│   └── ws-backend/        # Node.js WebSocket Server (Real-time Sync)
├── packages/
│   ├── db/                # Prisma schema + client (shared)
│   ├── common/            # Shared Zod schemas & TypeScript types
│   ├── ui/                # Shared React components
│   ├── eslint-config/     # Global lint rules
│   └── typescript-config/ # Base TS configurations
├── turbo.json
└── pnpm-workspace.yaml
```

### System Diagram

```mermaid
graph TD
    subgraph CLIENT["🖥️  Browser Client — Next.js 14 (App Router)"]
        UI["⚛️  React UI
        Canvas · Toolbar · Auth Pages"]
        CANVAS["🎨  Rough.js Canvas Engine
        Infinite drawing surface"]
        WS_CLIENT["🔌  WebSocket Client
        Auto-reconnect logic"]
        AXIOS["📡  Axios HTTP Client
        REST request handler"]
        UI --> CANVAS
        UI --> WS_CLIENT
        UI --> AXIOS
    end

    subgraph HTTP_SVC["🟦  HTTP Backend — Express.js (Railway)"]
        AUTH_MW["🔐  Auth Middleware
        JWT verification on every request"]
        AUTH_ROUTES["🛡️  Auth Routes
        Signup · Signin · OAuth callback"]
        ROOM_ROUTES["🗂️  Room Routes
        Create · Fetch by slug"]
        SHAPE_ROUTES["📐  Shape Routes
        Fetch historical canvas state"]
        CORS_MW["🌐  CORS + Preflight Handler
        Global OPTIONS resolution"]
        CORS_MW --> AUTH_MW
        AUTH_MW --> AUTH_ROUTES
        AUTH_MW --> ROOM_ROUTES
        AUTH_MW --> SHAPE_ROUTES
    end

    subgraph WS_SVC["🟩  WebSocket Backend — Node.js ws (Railway)"]
        WS_AUTH["🔑  Token Verifier
        Validates JWT from query param on connect"]
        ROOM_MGR["🏠  Room Manager
        Maps roomId → Set of active sockets"]
        BROADCASTER["📢  Shape Broadcaster
        Fan-out draw events to all peers in room"]
        DB_FLUSH["💾  Periodic DB Flush
        Batches shape writes to Postgres"]
        WS_AUTH --> ROOM_MGR
        ROOM_MGR --> BROADCASTER
        BROADCASTER --> DB_FLUSH
    end

    subgraph DATA["🗄️  Data Layer"]
        PG[("🐘  PostgreSQL
        Users · Rooms · Shapes")]
        PRISMA["🔷  Prisma ORM
        Shared @repo/db package
        Type-safe queries & migrations"]
        PRISMA --> PG
    end

    subgraph OAUTH["🔒  OAuth Providers"]
        GOOGLE["🔵  Google OAuth 2.0"]
        GITHUB["⚫  GitHub OAuth"]
    end

    %% Client ↔ HTTP Backend
    AXIOS -- "HTTPS REST
    /api/v1/auth · /room · /shapes" --> CORS_MW
    AUTH_ROUTES -- "Issues JWT
    (jsonwebtoken)" --> AXIOS

    %% Client ↔ WS Backend
    WS_CLIENT -- "WSS Connection
    ?token=JWT in query" --> WS_AUTH
    BROADCASTER -- "Broadcasts shape events
    { type: draw, shape: {...} }" --> WS_CLIENT

    %% HTTP Backend ↔ DB
    SHAPE_ROUTES -- "Prisma Client
    Read historical shapes" --> PRISMA
    ROOM_ROUTES -- "Prisma Client
    Create / lookup rooms" --> PRISMA
    AUTH_ROUTES -- "Prisma Client
    User upsert / lookup" --> PRISMA

    %% WS Backend ↔ DB
    DB_FLUSH -- "Prisma Client
    Batch-write canvas state" --> PRISMA

    %% OAuth flow
    AUTH_ROUTES -- "Redirect to provider" --> GOOGLE
    AUTH_ROUTES -- "Redirect to provider" --> GITHUB
    GOOGLE -- "OAuth callback + profile" --> AUTH_ROUTES
    GITHUB -- "OAuth callback + profile" --> AUTH_ROUTES

    %% Styling
    classDef clientBox fill:#1e1b4b,stroke:#6366f1,color:#e0e7ff
    classDef httpBox fill:#1e3a5f,stroke:#3b82f6,color:#dbeafe
    classDef wsBox fill:#14532d,stroke:#22c55e,color:#dcfce7
    classDef dataBox fill:#3b1f00,stroke:#f59e0b,color:#fef3c7
    classDef oauthBox fill:#1c1917,stroke:#a8a29e,color:#f5f5f4

    class UI,CANVAS,WS_CLIENT,AXIOS clientBox
    class AUTH_MW,AUTH_ROUTES,ROOM_ROUTES,SHAPE_ROUTES,CORS_MW httpBox
    class WS_AUTH,ROOM_MGR,BROADCASTER,DB_FLUSH wsBox
    class PG,PRISMA dataBox
    class GOOGLE,GITHUB oauthBox
```

The diagram above covers every layer of the system:

- **Next.js Client** — The browser app splits responsibilities between the Rough.js canvas engine (drawing), Axios (REST calls), and a dedicated WebSocket client (live sync) so each concern is independently manageable.
- **HTTP Backend** — All incoming requests pass through the global CORS preflight handler and then JWT middleware before reaching auth, room, or shape route handlers. This ensures no unauthenticated data ever reaches business logic.
- **WS Backend** — On connection, the token verifier validates the JWT passed in the query string. Verified clients are registered into an in-memory Room Manager. When a shape event arrives, the Broadcaster fans it out to every peer in that room, and a periodic flush job batches shape writes to Postgres — keeping the hot path pure in-memory for minimum latency.
- **Prisma / PostgreSQL** — A single shared `@repo/db` package exposes the Prisma client to both backends, guaranteeing schema consistency and type safety across the entire monorepo.
- **OAuth Providers** — Google and GitHub OAuth flows are handled entirely by the HTTP backend; the client simply redirects and receives a JWT on callback.

---

## 🔄 Data Flow

**1. Authentication**
> Client → POST `/auth/signin` or OAuth → HTTP Backend validates → Issues JWT

**2. Room Creation**
> Authenticated POST `/room` → HTTP Backend → Creates DB record → Returns `roomId` + `slug`

**3. WebSocket Connection**
> Client navigates to `/canvas/[roomId]` → Opens WSS with JWT in query → WS Backend verifies token

**4. Real-Time Drawing**
> Client draws shape → Sends `{ type: "draw", shape: {...} }` → WS Backend broadcasts to room → Periodically flushes state to DB

---

## 🛠️ Tech Stack

### Backend
| Category | Technology | Purpose |
|---|---|---|
| Runtime | ![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=nodedotjs&logoColor=white) | Execution environment |
| REST API | ![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white) | HTTP routing, CORS, auth middleware |
| Real-time | ![WebSockets](https://img.shields.io/badge/ws-WebSocket-010101?logo=socket.io) | Low-overhead bidirectional communication |
| Database | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white) | Persistent storage for Users, Rooms, Shapes |
| ORM | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white) | Type-safe queries & schema migrations |
| Auth | ![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white) | Session management |

### Frontend
| Category | Technology | Purpose |
|---|---|---|
| Framework | ![Next.js](https://img.shields.io/badge/Next.js_14-000000?logo=nextdotjs&logoColor=white) | App Router, SSR, client components |
| Styling | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) | Utility-first responsive design |
| HTTP Client | ![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white) | REST requests |
| Canvas | **Rough.js** | Sketch-style hardware-accelerated drawing |
| Icons | ![Lucide](https://img.shields.io/badge/Lucide_React-F56565?logo=lucide&logoColor=white) | Scalable SVG iconography |
| Notifications | **Sonner** | Toast feedback for auth states |

### Infrastructure
| Service | Platform |
|---|---|
| Frontend | ![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white) |
| Backends | ![Railway](https://img.shields.io/badge/Railway-0B0D0E?logo=railway&logoColor=white) |
| Monorepo | ![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?logo=turborepo&logoColor=white) + pnpm workspaces |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.20+
- **pnpm** v9.x

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rajtejaswee/slate.git
cd slate

# 2. Install all dependencies
pnpm install

# 3. Generate Prisma client
pnpm run --filter=@repo/db generate

# 4. Configure environment variables (see below)

# 5. Start all dev servers
pnpm dev
```

### Environment Variables

**Frontend** — `apps/web/.env.local`
```env
NEXT_PUBLIC_HTTP_BACKEND=https://your-http-backend-url
NEXT_PUBLIC_WS_BACKEND=wss://your-ws-backend-url
```

**HTTP Backend** — `apps/http-backend/.env`
```env
PORT=8080
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=your_secure_secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**WS Backend** — `apps/ws-backend/.env`
```env
PORT=8081
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=your_secure_secret
FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

## 📡 API Reference

All endpoints are prefixed with `/api/v1`.

### Auth

| Method | Endpoint | Description | 
|---|---|---|
| `POST` | `/auth/signup` | Register new user (`name`, `email`, `password`) | 
| `POST` | `/auth/signin` | Login, returns JWT |
| `GET` | `/auth/google` | Initiate Google OAuth flow | 
| `GET` | `/auth/github` | Initiate GitHub OAuth flow |

### Rooms & Canvas

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/room` | Create a new room (`{ "slug": string }`) | ✅ Bearer |
| `GET` | `/room/slug/:slug` | Get room ID by slug | ✅ Bearer |
| `GET` | `/room/:roomId/shapes` | Fetch historical shape data for a canvas | ✅ Bearer |

---

## 🌐 Deployment

| Service | Platform | Notes |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | Set `PNPM_VERSION=9.1.0` in env settings for build compatibility |
| **HTTP Backend** | [Railway](https://railway.app) | Containerized, binds to `$PORT` dynamically |
| **WS Backend** | [Railway](https://railway.app) | Containerized, must be accessed via `wss://` |
| **Database** | [NeonDb](https://neon.com) | Hosted Postgres, URL injected via `DATABASE_URL` |

---

## 🧠 Design Decisions

- **Separated WS and HTTP servers** — Heavy persistent HTTP requests never block the real-time WebSocket thread, ensuring consistent low-latency collaboration.
- **Shared `@repo/common` package** — Enforces strict type boundaries across client and server via shared Zod schemas and TypeScript interfaces.
- **Explicit OPTIONS handling** — Global preflight management ensures secure, uninterrupted CORS resolution for authenticated headers across all clients.
- **Auto-reconnect on the client** — WebSocket drop/reconnect logic is handled transparently; the user's canvas view is never interrupted.
- **JWT in WS query params** — Allows the stateful WS server to authenticate connections without a separate HTTP handshake.

---

## 📞 Contact & Support

**Raj Tejaswee**  
Full Stack Developer 

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/raj-tejaswee-147603247/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rajtejaswee)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rajtejaswee02@gmail.com)

---
<div align="center">

⭐ If you found this project useful, please consider giving it a star!

</div>
