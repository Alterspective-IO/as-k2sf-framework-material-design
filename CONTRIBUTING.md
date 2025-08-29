# Contributing to AS K2SF Framework Material Design

First off, thank you for considering contributing to the AS K2SF Framework Material Design! It's people like you that make this framework better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Accept feedback gracefully

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment details (OS, Node version, K2 version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- A clear and descriptive title
- A detailed description of the proposed functionality
- Examples of how the feature would be used
- Any relevant mockups or diagrams

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes (`npm test`)
4. Make sure your code follows the existing style
5. Write a clear commit message

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Setting Up Your Development Environment

1. Fork and clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/as-k2sf-framework-material-design.git
cd as-k2sf-framework-material-design
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment example file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Build the project:
```bash
npm run build
```

5. Run tests:
```bash
npm test
```

### Project Structure

```
src/
├── DataTables/     # DataTable extension components
├── Card/           # Card components
├── Common/         # Shared utilities and helpers
├── Icons/          # Icon components
└── index.ts        # Main entry point

framework/
├── src/            # Core framework code
└── interfaces/     # TypeScript interfaces

tests/              # Test files
```

## Style Guide

### TypeScript/JavaScript

- Use TypeScript for new code
- Follow existing code formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Prefer `const` over `let` when possible

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

## Testing

- Write tests for new functionality
- Ensure all tests pass before submitting PR
- Include both unit and integration tests where appropriate

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Documentation

- Update relevant documentation for any changes
- Include JSDoc comments for public APIs
- Update the README if needed
- Add examples for new features

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.