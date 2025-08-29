# Playwright Installation and Testing Instructions

## Prerequisites
Before running the Playwright tests, you need to install Playwright and its dependencies.

## Installation Steps

### 1. Install Playwright
```bash
npm install --save-dev @playwright/test --legacy-peer-deps
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Install Node.js Types (if needed)
```bash
npm install --save-dev @types/node --legacy-peer-deps
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run tests in headed mode (with browser visible)
```bash
npx playwright test --headed
```

### Run specific test file
```bash
npx playwright test tests/03-custom-buttons-enhanced.spec.ts
```

### Run tests with UI mode
```bash
npx playwright test --ui
```

### Generate test report
```bash
npx playwright show-report
```

## Test Coverage

The test suite covers the following functionality:

### ✅ **Basic Page Loading**
- Page loads correctly
- Grid initializes with data
- Statistics display properly
- All control buttons are visible

### ✅ **Edit Functionality**
- Edit button enables editing mode
- Save button saves changes and exits edit mode
- Cancel button restores original values
- Visual indicators work correctly

### ✅ **Task Management**
- Add new tasks
- Toggle active/inactive status
- Process conditional actions (urgent/process)
- Show task details

### ✅ **Filtering and Search**
- Search by task name
- Filter by status (Pending, In Progress, Completed)
- Filter by priority (High, Medium, Low)

### ✅ **Data Export**
- Export to CSV
- Export to JSON
- Export to Excel

### ✅ **Workflow Simulation**
- Automated task processing
- Progress tracking
- Status updates

### ✅ **User Interface**
- Material Design components render correctly
- Material Icons display properly
- Keyboard navigation works
- Debug log functionality

### ✅ **Validation Tests**
- Confirms no approve/reject functionality exists
- Validates removal of approval workflow
- Ensures only expected statuses are available

## Test Structure

```
tests/
├── 03-custom-buttons-enhanced.spec.ts  # Main test file
└── README.md                           # This file

playwright.config.ts                    # Playwright configuration
```

## Troubleshooting

### Common Issues

1. **Authentication Error (401)**
   - Use `--legacy-peer-deps` flag when installing packages
   - Check npm registry configuration

2. **Webpack Dependency Conflicts**
   - Use `--legacy-peer-deps` or `--force` flags
   - Consider updating webpack dependencies

3. **Browser Not Found**
   - Run `npx playwright install` to download browsers
   - Ensure internet connection for browser downloads

4. **File Path Issues**
   - Tests use absolute file paths to local HTML files
   - Ensure the HTML file exists at the expected location

### Expected Test Results

When all tests pass, you should see:
- ✅ 20+ test cases passing
- 0 failures
- Coverage of all major functionality
- Screenshots/videos available for any failures

The tests validate that the 03-custom-buttons-enhanced.html page works correctly after removing the approve/reject functionality, ensuring all remaining features function as expected.
