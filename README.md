# KeyBox

A local, privacy-first password and API key manager that runs entirely in your browser.

## Features

- **Login Account Management** - Store email accounts with passwords, recovery emails, and 2FA secrets
- **API Key Management** - Organize API keys for various providers (OpenAI, Anthropic, etc.)
- **TOTP Support** - Generate live 2FA codes with countdown timer
- **Custom Types** - Create custom login types and API providers with color labels
- **Import/Export** - Backup and restore your data in JSON format
- **100% Local** - All data stored in browser localStorage, nothing sent to servers

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [otplib](https://github.com/yeojz/otplib) - TOTP generation

## Getting Started

### Prerequisites

- Node.js 18+ or Bun

### Installation

```bash
# Clone the repository
git clone https://github.com/i-richardwang/KeyBox.git
cd keybox

# Install dependencies
bun install
# or
npm install

# Start development server
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

## Security

KeyBox stores all data locally in your browser's localStorage. No data is ever transmitted to external servers. However, please note:

- Data is not encrypted at rest in localStorage
- Anyone with access to your browser can view the stored data
- For sensitive credentials, consider using a dedicated password manager with encryption

## License

MIT
