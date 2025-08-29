# Manual Playwright Installation Guide

Since the automated installation is blocked by GitHub npm registry authentication, please follow these manual steps:

## Step 1: Temporarily configure npm registry
```bash
# Save current registry
npm config get registry

# Set to public npm registry temporarily
npm config set registry https://registry.npmjs.org/

# Install Playwright dependencies
npm install --save-dev @playwright/test @types/node

# Install Playwright browsers
npx playwright install

# Restore original registry (replace with your saved registry)
npm config set registry https://npm.pkg.github.com
```

## Step 2: Run the tests
```bash
# Run all tests
npm run test:e2e

# Run tests with browser visible
npm run test:e2e:headed

# Run tests with UI mode
npm run test:e2e:ui
```

## Alternative: Global Installation
If the above doesn't work, install Playwright globally:

```bash
npm install -g @playwright/test
npx playwright install
```

Then run tests directly:
```bash
npx playwright test tests/03-custom-buttons-enhanced.spec.ts
```

## Expected Test Output
When successful, you should see output similar to:
```
Running 20 tests using 1 worker

✓ should load the page and display the grid (2s)
✓ should display statistics cards (1s)
✓ should display control buttons (1s)
✓ should have edit buttons in each row (1s)
✓ should enable editing mode when Edit button is clicked (2s)
✓ should save changes when Save button is clicked (3s)
✓ should cancel editing when Cancel button is clicked (2s)
✓ should toggle active status (1s)
✓ should process conditional actions (2s)
✓ should add new task (1s)
✓ should filter tasks by status (1s)
✓ should search tasks (1s)
✓ should export data (2s)
✓ should simulate workflow (5s)
✓ should show task details (1s)
✓ should handle keyboard navigation (1s)
✓ should clear debug log (1s)
✓ should validate no approve/reject functionality exists (1s)
✓ should handle Material Design components properly (3s)

20 passed (35s)
```

## What the Tests Validate

### 🔍 **Functionality Tests**
- ✅ Grid loads with task data
- ✅ Edit mode works (Edit → Save/Cancel)
- ✅ Task management (Add, Toggle, Process)
- ✅ Search and filtering
- ✅ Data export functionality
- ✅ Workflow simulation

### 🔍 **UI/UX Tests**
- ✅ Material Design components render
- ✅ Material Icons display correctly
- ✅ Statistics cards show data
- ✅ Control buttons are functional
- ✅ Debug logging works

### 🔍 **Regression Tests**
- ✅ No approve/reject buttons exist
- ✅ No approval column in grid
- ✅ No approved/rejected statuses in filters
- ✅ Bulk approve/reject buttons removed

This comprehensive test suite ensures the page works correctly after removing the approval workflow functionality.
