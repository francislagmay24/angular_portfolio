# Database (MySQL + MySQL Workbench)

The app stores two things in MySQL:

| Table | Written by | Read by |
| --- | --- | --- |
| `users` | `schema.sql` (seed) / your own SQL | the login flow |
| `contact_messages` | the portfolio contact form | you, via Workbench |

Schema name: **`angular_portfolio`**

## 1. Create the schema

`schema.sql` creates both tables and seeds a demo account.

**Option A — MySQL Workbench (as you asked):**

1. Open **MySQL Workbench** and connect to your server (`localhost:3306`).
2. **File ▸ Open SQL Script...** and select `Database/schema.sql`.
3. Run it with the lightning-bolt button (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd>).
4. The final `SELECT` should return one row: `admin@example.com`.

**Option B — command line:**

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < Database/schema.sql
```

The script is safe to re-run: it uses `CREATE ... IF NOT EXISTS` and only inserts
the demo row when that email is absent.

> **Note:** the account you point the app at needs `CREATE DATABASE` (or an admin
> must create the schema for you). The least-privilege app user is deliberately
> DML-only, so it *cannot* create the schema itself. See step 3.

## 2. Point the app at it

`ConnectionStrings:Default` in `appsettings.json`:

```json
"ConnectionStrings": {
  "Default": "Server=localhost;Port=3306;Database=angular_portfolio;User=blazorapp;Password=CHANGE_ME;SslMode=Preferred"
}
```

Prefer user-secrets so no password is committed:

```powershell
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Server=localhost;Port=3306;Database=angular_portfolio;User=blazorapp;Password=CHANGE_ME;SslMode=Preferred"
```

### JWT signing key

The API refuses to start without a signing key of at least 32 bytes. Set one for
local development:

```powershell
dotnet user-secrets set "Jwt:Key" "<a long random string, 32+ characters>"
```

A development-only key is already in `appsettings.Development.json` so this works
out of the box. **Replace it before deploying.**

## 3. Arrange the application user

The schema script's `CREATE USER` / `GRANT` block is **commented out**, because
creating a MySQL user needs administrative rights. Ask your DBA (or run it as
`root`) once:

```sql
CREATE USER IF NOT EXISTS 'blazorapp'@'localhost' IDENTIFIED BY 'CHANGE_ME';
GRANT SELECT, INSERT, UPDATE, DELETE ON `angular_portfolio`.* TO 'blazorapp'@'localhost';
FLUSH PRIVILEGES;
```

Note this grants DML only — the app cannot create or drop tables, so a bug or an
injection flaw cannot restructure your schema.

## 4. Demo credentials

| Email | Password |
| --- | --- |
| `admin@example.com` | `Passw0rd!` |

The seeded hash is BCrypt (cost 12) and was verified against BCrypt.Net-Next
4.2.1 before being committed. **Change or delete this account before deploying.**

## 5. Adding users

Passwords are stored as BCrypt hashes. Generate one with the built-in helper:

```powershell
dotnet run -- hash-password "YourNewPassword"
```

Then in Workbench:

```sql
INSERT INTO `users` (`Email`, `DisplayName`, `PasswordHash`, `Role`, `IsActive`, `CreatedUtc`)
VALUES ('jane@example.com', 'Jane Doe', '<paste the hash here>', 'User', 1, UTC_TIMESTAMP(6));
```

Store emails lower-cased — the app normalises input before lookup, and the
`IX_users_Email` unique index is what makes that lookup cheap.

To revoke access without deleting history, set `IsActive = 0`; the login endpoint
then refuses the account (and says only "invalid email or password", so it does
not reveal that the account exists).

## 6. Reading contact form messages

Every submission from the portfolio page lands in `contact_messages`. The
dashboard at `/dashboard` shows them, or:

```sql
SELECT `Id`, `Name`, `Email`, `Company`, `Message`, `CreatedUtc`
FROM `contact_messages`
WHERE `IsHandled` = 0
ORDER BY `CreatedUtc` DESC;
```

Mark one as dealt with when you have replied:

```sql
UPDATE `contact_messages` SET `IsHandled` = 1 WHERE `Id` = 7;
```

Two behaviours worth knowing:

- **Honeypot.** The form has a hidden `Website` field. If a bot fills it in, the
  row is silently discarded and the bot is shown the normal success message.
- **Store failures are surfaced.** If MySQL is unreachable, the visitor is told
  to email you directly instead of seeing a fake success.

## Notes

- **No EF migrations.** The tables are created by `schema.sql`, and `Data/AppDbContext.cs`
  maps onto them by hand. Update both together if you change the shape.
- Column and table names are lowercase because the server here runs with
  `lower_case_table_names = 1`. On a case-sensitive server, keep the casing
  exactly as written in `schema.sql` and `AppDbContext.cs`.
- `DbSet` names are plural (`Users`, `ContactMessages`) while the tables are
  snake_case (`users`, `contact_messages`); the mapping is explicit in
  `OnModelCreating` rather than relying on conventions.
