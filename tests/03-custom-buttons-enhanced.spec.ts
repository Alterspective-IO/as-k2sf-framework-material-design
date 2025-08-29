import { test, expect, Page } from '@playwright/test';
import path from 'path';

// File path to the HTML file
const HTML_FILE_PATH = path.join(__dirname, '..', 'Test', 'TUIGrid', '03-custom-buttons-enhanced.html');

test.describe('03 Custom Buttons Enhanced - TUI Grid', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Navigate to the local HTML file
    await page.goto(`file://${HTML_FILE_PATH}`);
    
    // Wait for the grid to initialize
    await page.waitForSelector('#buttonGrid', { timeout: 10000 });
    
    // Wait for data to load
    await page.waitForFunction(() => {
      const grid = document.querySelector('#buttonGrid');
      return grid && grid.textContent && grid.textContent.includes('Task');
    }, { timeout: 15000 });
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should load the page and display the grid', async () => {
    // Check page title
    await expect(page).toHaveTitle(/03\. Enhanced Custom Button Renderers/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('03. Enhanced Custom Button Renderers');
    
    // Check that the grid container exists
    await expect(page.locator('#buttonGrid')).toBeVisible();
    
    // Check that tasks are loaded
    const gridRows = page.locator('.tui-grid-tbody tr');
    await expect(gridRows).toHaveCount({ min: 1 });
    
    // Check that task data is visible
    await expect(page.locator('.tui-grid-cell')).toContainText(['Update Database Schema', 'Review Documentation', 'Fix Critical Bug']);
  });

  test('should display statistics cards', async () => {
    // Check that all stat cards are present
    await expect(page.locator('#totalTasks')).toBeVisible();
    await expect(page.locator('#pendingTasks')).toBeVisible();
    await expect(page.locator('#completedTasks')).toBeVisible();
    await expect(page.locator('#urgentTasks')).toBeVisible();
    
    // Check that stats have numeric values
    const totalTasks = await page.locator('#totalTasks').textContent();
    expect(parseInt(totalTasks || '0')).toBeGreaterThan(0);
  });

  test('should display control buttons', async () => {
    // Check main control buttons
    await expect(page.locator('text=Add Task')).toBeVisible();
    await expect(page.locator('text=Undo')).toBeVisible();
    await expect(page.locator('text=Redo')).toBeVisible();
    await expect(page.locator('text=Export CSV')).toBeVisible();
    await expect(page.locator('text=Export JSON')).toBeVisible();
    await expect(page.locator('text=Export Excel')).toBeVisible();
    
    // Check search and filter controls
    await expect(page.locator('#searchInput')).toBeVisible();
    await expect(page.locator('#filterStatus')).toBeVisible();
    await expect(page.locator('#filterPriority')).toBeVisible();
  });

  test('should have edit buttons in each row', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Check that Edit buttons are present
    const editButtons = page.locator('button:has-text("Edit")');
    await expect(editButtons).toHaveCount({ min: 1 });
    
    // Check that edit buttons are enabled
    const firstEditButton = editButtons.first();
    await expect(firstEditButton).toBeEnabled();
  });

  test('should enable editing mode when Edit button is clicked', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Click the first Edit button
    const editButtons = page.locator('button:has-text("Edit")');
    const firstEditButton = editButtons.first();
    await firstEditButton.click();
    
    // Wait for editing mode to activate
    await page.waitForTimeout(1000);
    
    // Check that Save and Cancel buttons appear
    await expect(page.locator('button:has-text("Save")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible({ timeout: 5000 });
    
    // Check for notification that editing is enabled
    await expect(page.locator('mwc-snackbar')).toBeVisible({ timeout: 5000 });
  });

  test('should save changes when Save button is clicked', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Click the first Edit button
    const editButtons = page.locator('button:has-text("Edit")');
    const firstEditButton = editButtons.first();
    await firstEditButton.click();
    
    // Wait for editing mode
    await page.waitForTimeout(1000);
    
    // Find and click a task name cell to edit it
    const taskCells = page.locator('.tui-grid-cell[data-column-name="taskName"]');
    const firstTaskCell = taskCells.first();
    await firstTaskCell.click();
    
    // Wait a bit for editing to start
    await page.waitForTimeout(500);
    
    // Clear and type new value
    await page.keyboard.selectAll();
    await page.keyboard.type('Modified Task Name');
    await page.keyboard.press('Enter');
    
    // Click Save button
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();
    
    // Wait for save to complete
    await page.waitForTimeout(1000);
    
    // Check that Edit button reappears (editing mode ended)
    await expect(page.locator('button:has-text("Edit")')).toBeVisible({ timeout: 5000 });
    
    // Check for success notification
    const debugOutput = page.locator('#debugOutput');
    await expect(debugOutput).toContainText('Changes saved');
  });

  test('should cancel editing when Cancel button is clicked', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Get original task name
    const taskCells = page.locator('.tui-grid-cell[data-column-name="taskName"]');
    const firstTaskCell = taskCells.first();
    const originalText = await firstTaskCell.textContent();
    
    // Click the first Edit button
    const editButtons = page.locator('button:has-text("Edit")');
    const firstEditButton = editButtons.first();
    await firstEditButton.click();
    
    // Wait for editing mode
    await page.waitForTimeout(1000);
    
    // Click Cancel button
    const cancelButton = page.locator('button:has-text("Cancel")');
    await cancelButton.click();
    
    // Wait for cancel to complete
    await page.waitForTimeout(1000);
    
    // Check that Edit button reappears
    await expect(page.locator('button:has-text("Edit")')).toBeVisible({ timeout: 5000 });
    
    // Check that original text is restored
    await expect(firstTaskCell).toContainText(originalText || '');
    
    // Check for cancellation notification
    const debugOutput = page.locator('#debugOutput');
    await expect(debugOutput).toContainText('Editing cancelled');
  });

  test('should toggle active status', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Find a toggle button
    const toggleButtons = page.locator('button:has-text("Active"), button:has-text("Inactive")');
    const firstToggleButton = toggleButtons.first();
    
    // Get the current state
    const buttonText = await firstToggleButton.textContent();
    const isActive = buttonText?.includes('Active') || false;
    
    // Click the toggle button
    await firstToggleButton.click();
    
    // Wait for toggle to complete
    await page.waitForTimeout(1000);
    
    // Check that the state changed
    const newButtonText = await firstToggleButton.textContent();
    if (isActive) {
      expect(newButtonText).toContain('Inactive');
    } else {
      expect(newButtonText).toContain('Active');
    }
    
    // Check for toggle notification in debug log
    const debugOutput = page.locator('#debugOutput');
    await expect(debugOutput).toContainText('Active toggled');
  });

  test('should process conditional actions', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Find conditional action buttons (Process or Urgent)
    const conditionalButtons = page.locator('button:has-text("Process"), button:has-text("Urgent")');
    
    if (await conditionalButtons.count() > 0) {
      const firstConditionalButton = conditionalButtons.first();
      await firstConditionalButton.click();
      
      // Wait for processing
      await page.waitForTimeout(2000);
      
      // Check for processing notification in debug log
      const debugOutput = page.locator('#debugOutput');
      await expect(debugOutput).toContainText(['Processing task', 'Marked as urgent']);
    }
  });

  test('should add new task', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Get initial task count
    const initialTotalTasks = await page.locator('#totalTasks').textContent();
    const initialCount = parseInt(initialTotalTasks || '0');
    
    // Click Add Task button
    await page.locator('text=Add Task').click();
    
    // Wait for task to be added
    await page.waitForTimeout(1000);
    
    // Check that task count increased
    const newTotalTasks = await page.locator('#totalTasks').textContent();
    const newCount = parseInt(newTotalTasks || '0');
    expect(newCount).toBe(initialCount + 1);
    
    // Check for add notification in debug log
    const debugOutput = page.locator('#debugOutput');
    await expect(debugOutput).toContainText('Added new task');
  });

  test('should filter tasks by status', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Click on the status filter dropdown
    await page.locator('#filterStatus').click();
    
    // Wait for dropdown to open
    await page.waitForTimeout(500);
    
    // Select "Pending" status
    await page.locator('mwc-list-item[value="Pending"]').click();
    
    // Wait for filtering to complete
    await page.waitForTimeout(1000);
    
    // Check debug log for filter confirmation
    const debugOutput = page.locator('#debugOutput');
    await expect(debugOutput).toContainText('Filtered');
  });

  test('should search tasks', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Type in search box
    await page.locator('#searchInput').fill('Database');
    
    // Wait for search to filter results
    await page.waitForTimeout(1000);
    
    // Check debug log for filter confirmation
    const debugOutput = page.locator('#debugOutput');
    await expect(debugOutput).toContainText('Filtered');
  });

  test('should export data', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Set up download handling
    const downloadPromise = page.waitForEvent('download');
    
    // Click Export CSV button
    await page.locator('text=Export CSV').click();
    
    // Wait for download to start
    const download = await downloadPromise;
    
    // Check that download was initiated
    expect(download.suggestedFilename()).toMatch(/tasks_export_.*\.csv/);
    
    // Check for export notification in debug log
    const debugOutput = page.locator('#debugOutput');
    await expect(debugOutput).toContainText('Exported');
  });

  test('should simulate workflow', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Click Simulate button
    await page.locator('text=Simulate').click();
    
    // Wait for simulation to complete (it processes up to 5 tasks)
    await page.waitForTimeout(5000);
    
    // Check for simulation completion in debug log
    const debugOutput = page.locator('#debugOutput');
    await expect(debugOutput).toContainText('Workflow completed');
  });

  test('should show task details', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Find a Details button (default action)
    const detailsButtons = page.locator('button:has-text("Details")');
    
    if (await detailsButtons.count() > 0) {
      await detailsButtons.first().click();
      
      // Wait for details to be shown
      await page.waitForTimeout(1000);
      
      // Check for details in debug log
      const debugOutput = page.locator('#debugOutput');
      await expect(debugOutput).toContainText('Task details');
    }
  });

  test('should handle keyboard navigation', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Enable keyboard navigation
    await page.locator('text=Keyboard Nav').click();
    
    // Wait for toggle
    await page.waitForTimeout(500);
    
    // Test F2 key for editing (if supported)
    await page.keyboard.press('F2');
    
    // Wait a moment
    await page.waitForTimeout(1000);
    
    // Test Escape key to cancel any editing
    await page.keyboard.press('Escape');
    
    // Check debug log for keyboard navigation messages
    const debugOutput = page.locator('#debugOutput');
    await expect(debugOutput).toContainText('Keyboard navigation');
  });

  test('should clear debug log', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Click Clear Log button
    await page.locator('text=Clear Log').click();
    
    // Wait for clear to complete
    await page.waitForTimeout(500);
    
    // Check that log is cleared and shows the clear message
    const debugOutput = page.locator('#debugOutput');
    const logText = await debugOutput.textContent();
    expect(logText?.trim()).toBe('Debug output cleared');
  });

  test('should validate no approve/reject functionality exists', async () => {
    // Wait for grid to be fully loaded
    await page.waitForTimeout(2000);
    
    // Verify no approve/reject buttons exist
    await expect(page.locator('button:has-text("Approve")')).toHaveCount(0);
    await expect(page.locator('button:has-text("Reject")')).toHaveCount(0);
    await expect(page.locator('text=Bulk Approve')).toHaveCount(0);
    await expect(page.locator('text=Bulk Reject')).toHaveCount(0);
    
    // Verify no Approval column exists
    await expect(page.locator('text=Approval')).toHaveCount(0);
    
    // Verify status filter doesn't include Approved/Rejected
    await page.locator('#filterStatus').click();
    await page.waitForTimeout(500);
    await expect(page.locator('mwc-list-item[value="Approved"]')).toHaveCount(0);
    await expect(page.locator('mwc-list-item[value="Rejected"]')).toHaveCount(0);
  });

  test('should handle Material Design components properly', async () => {
    // Wait for page to load completely
    await page.waitForTimeout(3000);
    
    // Check that Material Design buttons are rendered properly
    const mwcButtons = page.locator('mwc-button');
    await expect(mwcButtons).toHaveCount({ min: 5 });
    
    // Check that Material Icons are loaded (not showing as text)
    const icons = page.locator('mwc-icon');
    if (await icons.count() > 0) {
      // Icons should be visible
      await expect(icons.first()).toBeVisible();
    }
    
    // Check that text fields are properly rendered
    const textFields = page.locator('mwc-textfield');
    await expect(textFields).toHaveCount({ min: 1 });
  });
});
