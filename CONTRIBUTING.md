# Contributing to Pentasec

Thank you for your interest in contributing to Pentasec! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates. When filing a bug report, include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Your environment (OS, Node.js version, Python version, browser)
- Screenshots or logs if applicable

### Suggesting Features

Feature requests are welcome. Please open an issue and include:

- A clear description of the feature
- The motivation or use case
- Any relevant examples or mockups

### Pull Requests

1. **Fork the repository** and create your branch from `main`.
2. **Set up your development environment** (see below).
3. **Make your changes** in a focused, well-scoped branch.
4. **Test your changes** to make sure nothing is broken.
5. **Write clear commit messages** that describe what changed and why.
6. **Open a pull request** with a description of your changes.

## Development Setup

### Prerequisites

- Node.js >= 18
- Python >= 3.9
- MongoDB (for web app development)
- Tesseract OCR (for AI redaction features)

### Web App

```bash
cd web
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

### Desktop App

```bash
# Frontend
cd desktop
npm install

# Backend
cd desktop/backend
pip install -r requirements.txt
cp .env.example .env
# Configure your .env file

# Run in development
cd desktop
npm run electron:dev
```

## Project Structure

- `web/` -- Next.js web application (marketing site, auth, docs)
- `desktop/` -- Electron desktop app with Python Flask backend
- `desktop/backend/` -- Python API server (Flask)
- `desktop/components/` -- React UI components for the desktop app

## Style Guidelines

### TypeScript / JavaScript

- Use TypeScript for all new code
- Follow the existing code style in the project
- Use functional React components with hooks

### Python

- Follow PEP 8 conventions
- Use type hints where practical
- Keep functions focused and well-named

### Commit Messages

- Use the imperative mood ("Add feature" not "Added feature")
- Keep the first line under 72 characters
- Reference issue numbers when applicable (e.g., "Fix #123")

## Review Process

- All submissions require review before merging
- Maintainers may request changes or ask questions on your PR
- Please be responsive to feedback

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
