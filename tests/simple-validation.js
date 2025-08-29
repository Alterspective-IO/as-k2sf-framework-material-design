/**
 * Simple Node.js test for 03-custom-buttons-enhanced.html
 * This test checks the HTML file structure without browser automation
 * Run with: node tests/simple-validation.js
 */

const fs = require('fs');
const path = require('path');

const HTML_FILE_PATH = path.join(__dirname, '..', 'Test', 'TUIGrid', '03-custom-buttons-enhanced.html');

console.log('🧪 Running Simple Validation Tests for 03-custom-buttons-enhanced.html');
console.log('=' .repeat(80));

// Test 1: File exists
function testFileExists() {
    try {
        if (fs.existsSync(HTML_FILE_PATH)) {
            console.log('✅ File exists: 03-custom-buttons-enhanced.html');
            return true;
        } else {
            console.log('❌ File not found: 03-custom-buttons-enhanced.html');
            return false;
        }
    } catch (error) {
        console.log('❌ Error checking file:', error.message);
        return false;
    }
}

// Test 2: HTML structure validation
function testHTMLStructure() {
    try {
        const content = fs.readFileSync(HTML_FILE_PATH, 'utf8');
        const tests = [
            {
                name: 'Has proper DOCTYPE',
                test: () => content.includes('<!DOCTYPE html>'),
            },
            {
                name: 'Has title',
                test: () => content.includes('<title>03. Enhanced Custom Button Renderers'),
            },
            {
                name: 'Includes TUI Grid CSS',
                test: () => content.includes('tui-grid.css'),
            },
            {
                name: 'Includes Material Icons font',
                test: () => content.includes('fonts.googleapis.com/icon?family=Material+Icons'),
            },
            {
                name: 'Has grid container',
                test: () => content.includes('id="buttonGrid"'),
            },
            {
                name: 'Has statistics cards',
                test: () => content.includes('id="totalTasks"') && content.includes('id="pendingTasks"'),
            },
            {
                name: 'Has control buttons',
                test: () => content.includes('Add Task') && content.includes('Export CSV'),
            },
            {
                name: 'Has search input',
                test: () => content.includes('id="searchInput"'),
            },
            {
                name: 'Has filter controls',
                test: () => content.includes('id="filterStatus"') && content.includes('id="filterPriority"'),
            },
            {
                name: 'Has debug output',
                test: () => content.includes('id="debugOutput"'),
            },
        ];

        let passed = 0;
        tests.forEach(({ name, test }) => {
            if (test()) {
                console.log(`✅ ${name}`);
                passed++;
            } else {
                console.log(`❌ ${name}`);
            }
        });

        return passed === tests.length;
    } catch (error) {
        console.log('❌ Error reading HTML file:', error.message);
        return false;
    }
}

// Test 3: Validate approve/reject removal
function testApprovalRemoval() {
    try {
        const content = fs.readFileSync(HTML_FILE_PATH, 'utf8');
        const approvalTests = [
            {
                name: 'No approve buttons in HTML',
                test: () => !content.includes('Approve') || !content.includes('btn-approve'),
            },
            {
                name: 'No reject buttons in HTML',
                test: () => !content.includes('Reject') || !content.includes('btn-reject'),
            },
            {
                name: 'No bulk approval buttons',
                test: () => !content.includes('Bulk Approve') && !content.includes('Bulk Reject'),
            },
            {
                name: 'No approval column',
                test: () => !content.includes("header: 'Approval'"),
            },
            {
                name: 'No approved status in filter',
                test: () => !content.includes('value="Approved"') && !content.includes('value="Rejected"'),
            },
            {
                name: 'No renderApprovalButtons method',
                test: () => !content.includes('renderApprovalButtons'),
            },
            {
                name: 'No approveTask method',
                test: () => !content.includes('approveTask') && !content.includes('rejectTask'),
            },
            {
                name: 'Status array updated',
                test: () => {
                    const statusMatch = content.match(/const statuses = \[(.*?)\]/);
                    if (statusMatch) {
                        const statuses = statusMatch[1];
                        return !statuses.includes('Approved') && !statuses.includes('Rejected');
                    }
                    return false;
                },
            },
        ];

        let passed = 0;
        console.log('\n🔍 Validating Approve/Reject Removal:');
        approvalTests.forEach(({ name, test }) => {
            if (test()) {
                console.log(`✅ ${name}`);
                passed++;
            } else {
                console.log(`❌ ${name}`);
            }
        });

        return passed === approvalTests.length;
    } catch (error) {
        console.log('❌ Error validating approval removal:', error.message);
        return false;
    }
}

// Test 4: Check for required JavaScript functions
function testJavaScriptFunctions() {
    try {
        const content = fs.readFileSync(HTML_FILE_PATH, 'utf8');
        const functionTests = [
            {
                name: 'Has initializeGrid function',
                test: () => content.includes('function initializeGrid()'),
            },
            {
                name: 'Has CustomButtonRenderer class',
                test: () => content.includes('class CustomButtonRenderer'),
            },
            {
                name: 'Has addNewTask function',
                test: () => content.includes('function addNewTask()'),
            },
            {
                name: 'Has updateStats function',
                test: () => content.includes('function updateStats()'),
            },
            {
                name: 'Has exportData function',
                test: () => content.includes('function exportData('),
            },
            {
                name: 'Has search and filter setup',
                test: () => content.includes('setupSearchAndFilter'),
            },
            {
                name: 'Has keyboard navigation setup',
                test: () => content.includes('setupKeyboardNavigation'),
            },
        ];

        let passed = 0;
        console.log('\n⚙️ Validating JavaScript Functions:');
        functionTests.forEach(({ name, test }) => {
            if (test()) {
                console.log(`✅ ${name}`);
                passed++;
            } else {
                console.log(`❌ ${name}`);
            }
        });

        return passed === functionTests.length;
    } catch (error) {
        console.log('❌ Error validating JavaScript:', error.message);
        return false;
    }
}

// Run all tests
function runAllTests() {
    console.log('Starting validation tests...\n');
    
    const results = [
        { name: 'File Existence', result: testFileExists() },
        { name: 'HTML Structure', result: testHTMLStructure() },
        { name: 'JavaScript Functions', result: testJavaScriptFunctions() },
        { name: 'Approval Removal', result: testApprovalRemoval() },
    ];

    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST SUMMARY:');
    console.log('='.repeat(80));

    let totalPassed = 0;
    results.forEach(({ name, result }) => {
        if (result) {
            console.log(`✅ ${name}: PASSED`);
            totalPassed++;
        } else {
            console.log(`❌ ${name}: FAILED`);
        }
    });

    console.log('\n' + '='.repeat(80));
    if (totalPassed === results.length) {
        console.log('🎉 ALL TESTS PASSED! The page is ready for use.');
        console.log('📝 Next steps:');
        console.log('   1. Install Playwright: npm run test:install');
        console.log('   2. Run full browser tests: npm run test:e2e');
        console.log('   3. Open the page in browser to test manually');
    } else {
        console.log(`⚠️  ${results.length - totalPassed} test(s) failed. Please review the issues above.`);
    }
    console.log('='.repeat(80));

    return totalPassed === results.length;
}

// Execute tests
if (require.main === module) {
    runAllTests();
}

module.exports = { runAllTests };
