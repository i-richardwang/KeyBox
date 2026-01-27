# KeyBox

A privacy-first password and API key manager with PostgreSQL database storage.

## Features

- **Login Account Management** - Store email accounts with passwords, recovery emails, and 2FA secrets
- **API Key Management** - Organize API keys for various providers (OpenAI, Anthropic, etc.)
- **TOTP Support** - Generate live 2FA codes with countdown timer
- **Custom Types** - Create custom login types and API providers with color labels
- **Import/Export** - Backup and restore your data in JSON format
- **Password Protection** - Optional password authentication
- **PostgreSQL Storage** - Persistent database storage with DrizzleORM

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [DrizzleORM](https://orm.drizzle.team/) - Database ORM
- [otplib](https://github.com/yeojz/otplib) - TOTP generation

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/i-richardwang/KeyBox.git
cd keybox

# Install dependencies
bun install
# or
npm install

# Copy environment variables
cp env.example .env.local

# Edit .env.local with your database connection
# DATABASE_URL=postgresql://user:password@localhost:5432/keybox
```

### Database Setup

```bash
# Push schema to database
bun run db:push

# Or generate and run migrations
bun run db:generate
bun run db:migrate
```

### Development

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
bun run build
bun start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_PASSWORD` | Password for authentication (optional) | No |

## Usage

### Adding Accounts

1. Click **Add Account** button
2. Select account type (Login or API Key)
3. Fill in the required fields
4. Click **Save**

### Managing Types

1. Click the **Settings** icon in the header
2. Add, edit, or delete login types and API providers
3. Customize colors for each type

### Import/Export

- **Export**: Click the menu (three dots) > Export to download a JSON backup
- **Import**: Click the menu > Import to restore from a JSON file

### Password Protection

Set `AUTH_PASSWORD` environment variable to enable password protection. Users will need to enter the password to access the vault.

## Database Scripts

| Command | Description |
|---------|-------------|
| `bun run db:generate` | Generate migration files |
| `bun run db:migrate` | Run migrations |
| `bun run db:push` | Push schema directly to database |
| `bun run db:studio` | Open Drizzle Studio |

## License

MIT
