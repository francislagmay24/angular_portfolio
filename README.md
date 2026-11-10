# Angular Portfolio

A developer portfolio built with **Angular 22** and **ASP.NET Core 10**, backed by
**MySQL 8** (schema: `angular_portfolio`). Includes a JWT login so you can show a
working full-stack auth flow in interviews.

## Editing your content

**Almost everything you need to change lives in one file:**

```
angular_portfolio.client/src/app/content/portfolio.data.ts
```

It holds your name, title, projects, skills, bio, contact details and social
links. Every value is a `<placeholder>` in angle brackets — find and replace
them with your own content, then run the app. You do not need to touch any HTML
to change your portfolio.

Also worth updating:

| What | Where |
| --- | --- |
| Page title / favicon | `angular_portfolio.client/src/index.html`, `public/favicon.ico` |
| Colours and fonts | `angular_portfolio.client/src/styles.css` (one CSS variable block) |
| Project screenshots | `public/projects/` — then set `imageUrl` in `portfolio.data.ts` |
| Your CV | `public/assets/` — then set `resumeUrl` in `portfolio.data.ts` |

## Running it

You need the .NET 10 SDK, Node.js, and MySQL 8 running locally.

### 1. Create the database

See **[Angular_Portfolio.Server/Database/README.md](Angular_Portfolio.Server/Database/README.md)**.
In short: open `Database/schema.sql` in MySQL Workbench and run it. That creates
the `angular_portfolio` schema, both tables, and a demo login.

### 2. Configure secrets

```powershell
cd Angular_Portfolio.Server
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Server=localhost;Port=3306;Database=angular_portfolio;User=blazorapp;Password=CHANGE_ME;SslMode=Preferred"
dotnet user-secrets set "Jwt:Key" "<a random string of at least 32 characters>"
```

### 3. Start it

From the repository root, either:

```powershell
dotnet run --project Angular_Portfolio.Server
```

which also starts the Angular dev server through the SPA proxy, or run the two
halves separately:

```powershell
# terminal 1 — API on https://localhost:7199
dotnet run --project Angular_Portfolio.Server

# terminal 2 — UI on https://localhost:59535 (proxies /api to the API)
cd angular_portfolio.client
npm start
```

## Demo login

| Email | Password |
| --- | --- |
| `admin@example.com` | `Passw0rd!` |

Signing in at `/login` shows the dashboard, which lists contact-form messages
read from MySQL. **Delete this account before deploying.**

## What the pages do

| Route | Purpose |
| --- | --- |
| `/` | The portfolio: hero, projects, skills, about, contact form |
| `/login` | Signs in against the `users` table, returns a JWT |
| `/dashboard` | Protected; lists submissions from the contact form |

## How the pieces fit

```
angular_portfolio.client/src/app/
  content/portfolio.data.ts   ← YOUR CONTENT LIVES HERE
  core/                       ← auth service, guard, HTTP interceptor, models
  home/                       ← the portfolio page (all sections)
  login/                      ← sign-in form
  dashboard/                  ← protected page listing contact messages

Angular_Portfolio.Server/
  Database/schema.sql         ← creates the MySQL schema
  Controllers/                ← AuthController, ContactController
  Data/AppDbContext.cs        ← EF Core mapping onto the schema
  Security/                   ← BCrypt hashing, JWT issuing
  Models/, Contracts/         ← entities and request/response DTOs
```

The `content/` data layer means the portfolio copy is version-controlled with
your code but never hard-coded into templates.

## Commands

```powershell
dotnet build Angular_Portfolio.slnx     # build the API
dotnet run --project Angular_Portfolio.Server       # run the API
dotnet run --project Angular_Portfolio.Server -- hash-password "NewPassword"

cd angular_portfolio.client
npm start              # dev server with hot reload
npm run build          # production build
npm test               # Vitest unit tests
```

## Security notes

This is a portfolio demo. Before putting it on the public internet:

- Replace the `Jwt:Key`, and delete or change the demo account.
- Move secrets to user-secrets or environment variables — never commit them.
- The JWT is kept in `localStorage`, which any script on the page can read. That
  is the common trade-off for a demo; for anything sensitive use httpOnly
  cookies with CSRF protection instead.
- The application database user has DML-only rights, so it cannot alter the
  schema even if the app is compromised.
