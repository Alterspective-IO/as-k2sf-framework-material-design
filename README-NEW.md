# AS K2SF Framework Material Design

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40alterspective-io%2Fas-k2sf-framework-material-design.svg)](https://badge.fury.io/js/%40alterspective-io%2Fas-k2sf-framework-material-design)

A comprehensive Material Design framework for K2 SmartForms, providing modern UI components and enhanced functionality including advanced data grids, cards, and form controls.

## Features

- 🎨 **Material Design Components** - Modern, responsive UI components following Material Design principles
- 📊 **Advanced Data Grids** - Transform K2 list views into feature-rich data tables with TUI Grid integration
- 🎴 **Smart Cards** - Flexible card layouts with dynamic content binding
- 🔧 **Easy Configuration** - JSON-based configuration system for rapid development
- 📱 **Responsive Design** - Mobile-friendly components that work across all devices
- 🚀 **Performance Optimized** - Efficient rendering and data handling for large datasets

## Quick Start

### Installation

```bash
npm install @alterspective-io/as-k2sf-framework-material-design
```

### Basic Usage

1. Add the framework to your K2 SmartForm
2. Create a control named with the appropriate tag (e.g., `MyGrid as-md-datatable`)
3. Add a configuration control named `as-md-page-settings`
4. Configure using JSON:

```json
{
  "as-md-datatable": {
    "extensionSettings": {
      "enabled": true
    },
    "templates": {
      "default": {
        "enabled": true,
        "autoGenerateColumns": true,
        "elevation": 2,
        "minHeight": 400
      }
    }
  }
}
```

## Documentation

- [Grid Configuration Guide](./Grid-Configuration-Guide.md) - Comprehensive grid setup and customization
- [Simple Grid Guide](./Simple-Grid-Guide.md) - Quick start guide for basic grid implementations
- [Understanding Grid Configuration](./Understanding-Grid-Configuration.md) - Deep dive into configuration options

## Key Components

### DataTable Extension

Transform K2 list views into powerful data grids with:
- Sorting, filtering, and pagination
- Inline editing capabilities
- Custom renderers and formatters
- Event handling and K2 rule integration
- Export functionality

### Card Components

Create dynamic card layouts with:
- Flexible content binding
- Material Design styling
- Responsive layouts
- Custom actions and events

### Configuration System

Hierarchical configuration with:
- Page-level settings
- Template-based configurations
- Target-specific overrides
- Runtime configuration updates

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- K2 SmartForms environment

### Setup

1. Clone the repository:
```bash
git clone https://github.com/alterspective-io/as-k2sf-framework-material-design.git
cd as-k2sf-framework-material-design
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Build the project:
```bash
npm run build
```

### Available Scripts

- `npm run build` - Build the project
- `npm test` - Run tests
- `npm run test:e2e` - Run end-to-end tests
- `npm start` - Start development server

## Project Structure

```
src/
├── DataTables/      # DataTable extension and renderers
│   ├── Extension/   # Core grid functionality
│   └── CustomRenderer/ # Custom cell renderers
├── Card/           # Card component implementation
├── Common/         # Shared utilities and helpers
├── Icons/          # Icon management
└── index.ts        # Main entry point

framework/
├── src/            # Core framework code
├── interfaces/     # TypeScript interfaces
└── Models/         # Data models and business logic

tests/              # Test suites
docs/              # Additional documentation
```

## API Reference

### Grid Methods (via TUI Grid)

```javascript
// Access grid instance
let gridElement = document.querySelector('[name*="as-md-datatable"]');
let grid = gridElement?.passPack?.grid;

// Available methods
grid.getData()                    // Get all data
grid.getValue(rowKey, columnName) // Get cell value
grid.setValue(rowKey, columnName, value) // Set cell value
grid.removeRows([rowKeys])        // Remove rows
grid.appendRow(data, options)     // Add row
grid.focusAt(rowIndex, columnIndex) // Focus cell
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

- 📖 [Documentation](https://github.com/alterspective-io/as-k2sf-framework-material-design/wiki)
- 🐛 [Issue Tracker](https://github.com/alterspective-io/as-k2sf-framework-material-design/issues)
- 💬 [Discussions](https://github.com/alterspective-io/as-k2sf-framework-material-design/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TUI Grid](https://github.com/nhn/tui.grid) for the powerful grid component
- [Material Design Web Components](https://github.com/material-components/material-web) for UI components
- K2 SmartForms community for feedback and contributions

## Authors

- **Igor Jericevich** - *Initial work* - [Alterspective IO](https://github.com/alterspective-io)

## Status

This project is actively maintained and welcomes contributions from the community.

### ⚠️ Important Note About Dependencies

This project originally depends on `@alterspective-io/as-framework-material-design`, which needs to be open-sourced separately. See [DEPENDENCY_NOTICE.md](DEPENDENCY_NOTICE.md) for details and workarounds.

Currently, the project uses TUI Grid directly. Full functionality will be available once the Material Design framework package is published.

---

Made with ❤️ by the Alterspective IO team