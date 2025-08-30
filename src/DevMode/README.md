# DevMode Configuration Builder

## Overview
DevMode is a comprehensive visual configuration builder for K2 Smartforms DataTables and other Material Design components. It provides an intuitive interface for configuring complex DataTables without manually editing JSON configurations.

## Features

### 🎨 Visual Configuration Builder
- **Drag-and-drop column management** - Easily reorder columns
- **Visual theme editor** - Customize colors, typography, and spacing
- **Live preview** - See changes in real-time
- **Template gallery** - Start with pre-built configurations
- **JSON editor** - Direct JSON editing with syntax highlighting

### 🤖 AI Assistant Integration
- **Natural language configuration** - Describe what you want in plain English
- **OpenAI GPT-4/GPT-3.5 support** - Intelligent configuration suggestions
- **Context-aware recommendations** - AI understands your current setup
- **Configuration validation** - AI helps identify and fix issues

### 🔧 Developer Experience
- **Query parameter activation** - Add `?devmode=true` to any URL
- **Keyboard shortcuts** - Ctrl+Shift+D to toggle panel
- **Undo/Redo support** - Full history tracking
- **Import/Export** - Share configurations easily
- **Validation engine** - Real-time error detection

## Getting Started

### 1. Enable DevMode
Add `?devmode=true` to your K2 Smartforms URL:
```
https://your-k2-server/Runtime/Form/FormName/?devmode=true
```

### 2. Select a Control
Click on any highlighted DataTable or supported control to begin configuration.

### 3. Configure Visually
Use the visual builders to:
- Add/remove/reorder columns
- Configure editors and formatters
- Set up filtering and sorting
- Customize theme and styling

### 4. AI Assistance (Optional)
1. Add your OpenAI API key in settings
2. Ask questions in natural language:
   - "Make the header blue with white text"
   - "Add a date column that formats as MM/DD/YYYY"
   - "Make the table responsive"

## Configuration Structure

### Column Configuration
```json
{
  "name": "columnName",
  "header": "Display Name",
  "k2Control": "TextBox1",
  "sortable": true,
  "resizable": true,
  "editor": "text",
  "formatter": "props.value.toUpperCase()",
  "filter": {
    "type": "text",
    "showApplyBtn": true
  }
}
```

### Theme Configuration
```json
{
  "preset": "light",
  "colors": {
    "primary": "#667eea",
    "background": "#ffffff",
    "text": {
      "primary": "#2d3748",
      "secondary": "#718096"
    }
  },
  "typography": {
    "fontFamily": "Roboto, sans-serif",
    "fontSize": {
      "small": "12px",
      "medium": "14px",
      "large": "16px"
    }
  }
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+D | Toggle DevMode panel |
| Ctrl+Z | Undo last change |
| Ctrl+Y | Redo last change |
| Ctrl+S | Save configuration |
| Escape | Close panel |

## AI Assistant Setup

### Prerequisites
- OpenAI API key (get one at https://platform.openai.com)

### Configuration
1. Click the settings icon in the AI Assistant tab
2. Enter your OpenAI API key
3. Select model (GPT-4 or GPT-3.5 Turbo)
4. Adjust temperature for creativity level

### Example Prompts
- "Add a column for email addresses with validation"
- "Make all date columns sortable"
- "Apply a dark theme to the table"
- "Add pagination with 20 rows per page"
- "Create a button column that triggers an approval action"

## Templates

### Basic Table
Simple sortable table with standard columns.

### Editable Grid
Grid with inline editing capabilities and validation.

### Approval Workflow
Table with status indicators and action buttons.

### Dashboard View
Compact view with charts and key metrics.

## Architecture

### Core Components
- **DevModeManager** - Main orchestrator
- **ConfigurationPanel** - UI container
- **LivePreviewEngine** - Real-time updates
- **ValidationEngine** - Configuration validation
- **ConfigurationStore** - State management
- **AIAssistant** - OpenAI integration

### State Management
- Centralized configuration store
- History tracking with undo/redo
- Local storage persistence
- Export/import functionality

## API Reference

### Global Access
```javascript
// Access DevMode programmatically
window.__devMode.sendMessage({
  action: 'UPDATE_CONFIGURATION',
  data: { /* configuration */ }
});
```

### Events
```javascript
// Listen for configuration changes
window.__devMode.subscribe((state) => {
  console.log('DevMode state:', state);
});
```

## Troubleshooting

### DevMode not appearing
- Ensure `?devmode=true` is in the URL
- Check browser console for errors
- Verify framework is properly initialized

### AI Assistant not working
- Verify API key is correct
- Check network connectivity
- Ensure sufficient API credits

### Configuration not applying
- Check validation panel for errors
- Verify control bindings are correct
- Ensure proper JSON formatting

## Best Practices

1. **Start with templates** - Use pre-built configurations as starting points
2. **Test incrementally** - Apply changes gradually and test
3. **Use validation** - Always check for validation errors
4. **Save frequently** - Use Ctrl+S to save your work
5. **Export configurations** - Keep backups of complex setups

## Contributing
To extend DevMode capabilities:

1. Add new component support in `DevModeManager.ts`
2. Create visual builders in `components/`
3. Add validation rules in `ValidationEngine.ts`
4. Extend AI prompts in `AIAssistant.tsx`

## Security Notes
- API keys are stored locally in browser storage
- Never commit API keys to version control
- Use environment-specific configurations
- Validate all user inputs

## Support
For issues or feature requests, please contact the development team or create an issue in the project repository.