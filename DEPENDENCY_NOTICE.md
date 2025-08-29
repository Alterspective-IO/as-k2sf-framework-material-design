# Important: Missing Dependency Package

## Current Situation

This project depends on `@alterspective-io/as-framework-material-design` (v0.0.15), which is currently a private package in GitHub packages. To fully open source this project, this dependency needs to be resolved.

## What This Package Provides

The `@alterspective-io/as-framework-material-design` package provides core Material Design components and types:

### Components:
- `AsMaterialdesignCard` - Card component
- `AsMaterialdesignDatatable` - DataTable component  
- `AsExpansionPanel` - Expansion panel component
- `AsHtmlRepeater` - HTML repeater component
- `Slider` - Slider component
- `Button` - Button component
- `Icon`, `MaterialDesignButton`, `MaterialDesignIcons` - UI components

### Types:
- Grid types: `OptColumn`, `OptGrid`, `OptHeader`, `OptPreset`
- Cell types: `CellRendererOptions`, `CellRendererProps`
- Data types: `Formatter`, `Row`, `SliderBase`
- Style types: `AlignType`, `VAlignType`, `SortingType`
- Filter types: `OptFilter`, `OptColumnHeaderInfo`
- Grid namespace types

## Resolution Options

### Option 1: Locate and Open Source the Original Package
The original source for `@alterspective-io/as-framework-material-design` needs to be:
1. Located (likely on the original development machine)
2. Cleaned of any sensitive data
3. Published to npm as a public package

### Option 2: Use TUI Grid Directly
Since many of the types and components wrap TUI Grid, you could:
1. Remove the dependency on `@alterspective-io/as-framework-material-design`
2. Import TUI Grid directly: `npm install tui-grid`
3. Create local type definitions for the custom components

### Option 3: Create a Replacement Package
Create a new open-source package that provides the same functionality:
1. Create types that match the expected interfaces
2. Implement or wrap TUI Grid components
3. Publish as `as-framework-material-design` on npm

## Temporary Workaround

Until the dependency is resolved, developers can:

1. **For GitHub Package Registry Access** (if you have permissions):
```bash
# Create .npmrc file
echo "@alterspective-io:registry=https://npm.pkg.github.com" > .npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> .npmrc
```

2. **Install TUI Grid as a fallback**:
```bash
npm install tui-grid @types/tui-grid
```

## Action Required

To make this project truly open source, one of the above resolution options must be implemented. The recommended approach is to locate and open source the original `@alterspective-io/as-framework-material-design` package.

## Contact

If you have access to the original `@alterspective-io/as-framework-material-design` source code, please contribute it to make this project fully functional for the open source community.