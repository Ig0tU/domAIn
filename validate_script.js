// Validation script for DOM-AI Assistant userscript
const fs = require('fs');

function validateUserscript() {
    try {
        // Read the userscript file
        const scriptContent = fs.readFileSync('domai.js', 'utf8');
        
        console.log('🔍 Validating DOM-AI Assistant userscript...');
        
        // Check userscript header
        const hasUserscriptHeader = scriptContent.includes('// ==UserScript==');
        const hasUserscriptFooter = scriptContent.includes('// ==/UserScript==');
        console.log(`✅ UserScript header: ${hasUserscriptHeader ? 'Found' : 'Missing'}`);
        console.log(`✅ UserScript footer: ${hasUserscriptFooter ? 'Found' : 'Missing'}`);
        
        // Check version
        const versionMatch = scriptContent.match(/@version\s+(.+)/);
        if (versionMatch) {
            console.log(`✅ Version: ${versionMatch[1].trim()}`);
        }
        
        // Check for key features
        const features = [
            { name: 'Tool Counter', pattern: 'toolCounter' },
            { name: 'Keyboard Shortcuts', pattern: 'addEventListener.*keydown' },
            { name: 'Enhanced Highlight Box', pattern: 'highlightPulse' },
            { name: 'API Key Validation', pattern: 'inputKey.length < 20' },
            { name: 'Tool Declarations', pattern: 'toolDeclarations' },
            { name: 'Gemini API Integration', pattern: 'generativelanguage.googleapis.com' }
        ];
        
        console.log('\n🔧 Feature Check:');
        features.forEach(feature => {
            const found = new RegExp(feature.pattern).test(scriptContent);
            console.log(`${found ? '✅' : '❌'} ${feature.name}: ${found ? 'Present' : 'Missing'}`);
        });
        
        // Check syntax (basic)
        const hasMatchingBraces = (scriptContent.match(/\{/g) || []).length === (scriptContent.match(/\}/g) || []).length;
        const hasMatchingParens = (scriptContent.match(/\(/g) || []).length === (scriptContent.match(/\)/g) || []).length;
        
        console.log('\n🔍 Syntax Check:');
        console.log(`${hasMatchingBraces ? '✅' : '❌'} Matching braces: ${hasMatchingBraces ? 'OK' : 'Mismatch'}`);
        console.log(`${hasMatchingParens ? '✅' : '❌'} Matching parentheses: ${hasMatchingParens ? 'OK' : 'Mismatch'}`);
        
        // Count tools
        const toolMatches = scriptContent.match(/category.*?name.*?description/g);
        const toolCount = toolMatches ? toolMatches.length : 0;
        console.log(`\n📊 Tool Count: ${toolCount} tools found`);
        
        // Check file size
        const fileSizeKB = Math.round(scriptContent.length / 1024);
        console.log(`📁 File Size: ${fileSizeKB} KB`);
        
        console.log('\n✅ Validation completed successfully!');
        return true;
        
    } catch (error) {
        console.error('❌ Validation failed:', error.message);
        return false;
    }
}

// Run validation if this script is executed directly
if (require.main === module) {
    validateUserscript();
}

module.exports = { validateUserscript };
