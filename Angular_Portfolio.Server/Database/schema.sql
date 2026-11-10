-- ---------------------------------------------------------------------------
-- Angular_Portfolio — login + contact database schema (MySQL 8.0+)
--
-- How to run in MySQL Workbench:
--   1. Open MySQL Workbench and connect to your local server (localhost:3306).
--   2. File > Open SQL Script... and select this file.
--   3. Execute it with the lightning-bolt button (Ctrl+Shift+Enter).
--   4. The final SELECT should return one row: admin@example.com
--
-- Safe to re-run: it only creates objects that are missing and seeds the demo
-- account only when that email is absent.
-- ---------------------------------------------------------------------------

CREATE DATABASE IF NOT EXISTS `angular_portfolio`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `angular_portfolio`;

-- ---------------------------------------------------------------------------
-- Application login accounts. One row per user who can sign in.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `Id`            INT             NOT NULL AUTO_INCREMENT,
    `Email`         VARCHAR(256)    NOT NULL,
    `DisplayName`   VARCHAR(128)    NOT NULL,
    `PasswordHash`  VARCHAR(512)    NOT NULL,
    `Role`          VARCHAR(64)     NOT NULL DEFAULT 'User',
    `IsActive`      TINYINT(1)      NOT NULL DEFAULT 1,
    `CreatedUtc`    DATETIME(6)     NOT NULL,
    `LastLoginUtc`  DATETIME(6)     NULL,
    PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_users_Email` (`Email`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Messages submitted through the portfolio contact form.
--
-- Triage with:
--   SELECT * FROM contact_messages WHERE IsHandled = 0 ORDER BY CreatedUtc DESC;
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `contact_messages` (
    `Id`          INT             NOT NULL AUTO_INCREMENT,
    `Name`        VARCHAR(120)    NOT NULL,
    `Email`       VARCHAR(256)    NOT NULL,
    `Company`     VARCHAR(160)    NULL,
    `Message`     VARCHAR(4000)   NOT NULL,
    `CreatedUtc`  DATETIME(6)     NOT NULL,
    `IsHandled`   TINYINT(1)      NOT NULL DEFAULT 0,
    `IpAddress`   VARCHAR(45)     NULL,
    PRIMARY KEY (`Id`),
    KEY `IX_contact_messages_IsHandled_CreatedUtc` (`IsHandled`, `CreatedUtc`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Demo account:  admin@example.com  /  Passw0rd!
--
-- PasswordHash is BCrypt (work factor 12) as produced by BCrypt.Net-Next,
-- which is what Security/PasswordHasher.cs uses.
--
-- This exact string was verified against BCrypt.Net-Next 4.2.1:
--   BCrypt.Verify("Passw0rd!", '<hash>') = true
--   BCrypt.Verify("wrong",     '<hash>') = false
--
-- Create your own hash with:
--   dotnet run -- hash-password "YourNewPassword"
--
-- NEVER ship this demo account to production.
-- ---------------------------------------------------------------------------
INSERT INTO `users` (`Email`, `DisplayName`, `PasswordHash`, `Role`, `IsActive`, `CreatedUtc`)
SELECT 'admin@example.com',
       'Demo Admin',
       '$2a$12$oF1qaJA0mEG.2AEdH.DqTuO7iw2Xl5sv4TrcuA1IOnyE1tHopiXi.',
       'Admin',
       1,
       UTC_TIMESTAMP(6)
WHERE NOT EXISTS (
    SELECT 1 FROM `users` WHERE `Email` = 'admin@example.com'
);

-- ---------------------------------------------------------------------------
-- Application database user.
--
-- NOTE: creating a MySQL user requires administrative rights, so this block
-- will fail with "Access denied ... CREATE USER" if you are running the script
-- as the low-privilege application account. That is expected and harmless —
-- ask your DBA (or run the block as root) once. The rest of the script does not
-- depend on it.
--
-- The account is deliberately granted only DML. It cannot create or drop
-- tables, so a bug or injection flaw cannot restructure your schema.
-- ---------------------------------------------------------------------------
-- CREATE USER IF NOT EXISTS 'angularapp'@'localhost' IDENTIFIED BY 'CHANGE_ME';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON `angular_portfolio`.* TO 'angularapp'@'localhost';
-- FLUSH PRIVILEGES;

SELECT `Id`, `Email`, `DisplayName`, `Role`, `IsActive`, `CreatedUtc`, `LastLoginUtc`
FROM `users`;
