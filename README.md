# Pentasec

Pentest reporting made effortless. Pentasec is an open-source penetration testing reporting and evidence management tool that helps security professionals generate professional vulnerability reports with AI assistance.

## Overview

Pentasec consists of two applications:

- **Web App** -- A Next.js marketing site with user authentication, documentation, and account management.
- **Desktop App** -- An Electron + Next.js application with a Python (Flask) backend for managing pentest projects, collecting evidence, and generating reports.

### Key Features

- **AI-Powered Report Generation** -- Automatically generate detailed vulnerability reports using Google Gemini.
- **Evidence Vault** -- Organize and manage screenshots, logs, and other pentest evidence.
- **AI Redaction** -- Automatically detect and redact sensitive information from reports and images.
- **Project Management** -- Create and track penetration testing engagements.
- **PDF Export** -- Generate professional PDF reports from your findings.
- **Report Archive** -- Store and browse historical reports.
- **Local Encryption** -- AES-256-GCM encryption for all sensitive local data.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Next.js 16, TypeScript, Tailwind CSS 4 |
| Desktop | Electron 40 |
| Backend | Python, Flask |
| Database | MongoDB (web), encrypted JSON (desktop) |
| AI | Google Generative AI (Gemini) |
| Auth | NextAuth.js (web), JWT (desktop) |
| UI | Radix UI, shadcn/ui |

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Python](https://www.python.org/) >= 3.9
- [MongoDB](https://www.mongodb.com/) (for the web app)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract) (for AI redaction features)
- A [Google Gemini API key](https://aistudio.google.com/apikey) (for AI report generation)

## Getting Started

### Web App

```bash
cd web
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and NextAuth settings
npm run dev
```

The web app will be available at `http://localhost:3000`.

### Desktop App

1. Install frontend dependencies:

```bash
cd desktop
npm install
```

2. Install Python backend dependencies:

```bash
cd desktop/backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
```

3. Run in development mode:

```bash
cd desktop
npm run electron:dev
```

Or run the backend separately:

```bash
cd desktop/backend
python app.py --no-electron
```

### Building the Desktop App

```bash
cd desktop
npm run dist
```

This produces platform-specific installers in the `release/` directory.

## Project Structure

```
pentasec/
├── web/                    # Next.js web application
│   ├── src/
│   │   ├── app/            # App router pages & API routes
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities (MongoDB client, helpers)
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
│
├── desktop/                # Electron desktop application
│   ├── app/                # Next.js pages for Electron renderer
│   ├── backend/            # Python Flask backend
│   │   ├── routes/         # API route handlers
│   │   ├── app.py          # Flask entry point
│   │   ├── config.py       # Path configuration
│   │   ├── database.py     # MongoDB operations
│   │   ├── encryption.py   # AES-256-GCM encryption
│   │   └── utils.py        # Helpers and AI integration
│   ├── components/         # React components
│   ├── main.js             # Electron main process
│   └── preload.js          # Electron preload script
│
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
└── README.md
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get involved.

## Security

If you discover a security vulnerability, please see [SECURITY.md](SECURITY.md) for responsible disclosure instructions. **Do not open a public issue for security vulnerabilities.**

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
