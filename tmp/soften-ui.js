const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Soften thickness
            content = content.replace(/font-black/g, 'font-semibold');
            
            // Remove aggressive 'cyberpunk' spacing and capitalization
            content = content.replace(/uppercase tracking-widest/g, 'font-medium tracking-wide');
            content = content.replace(/uppercase tracking-wider/g, 'font-medium tracking-wide');
            content = content.replace(/uppercase tracking-\[0\.2em\]/g, 'font-medium tracking-wide');
            
            // Change tiny font sizes into more reasonably human-readable sizes
            content = content.replace(/text-\[10px\]/g, 'text-sm text-opacity-80');
            content = content.replace(/text-\[9px\]/g, 'text-xs text-opacity-80');
            content = content.replace(/text-\[8px\]/g, 'text-xs text-opacity-80');
            
            // Soften rigid headers 
            content = content.replace(/tracking-tight/g, 'tracking-normal');

            // Slightly tone down extremely loud uppercase titles
            content = content.replace(/text-xs font-semibold uppercase/g, 'text-sm font-medium');

            fs.writeFileSync(fullPath, content);
        }
    }
}

processDir(path.join(__dirname, '..', '..', 'Desktop', 'enyata_hackathon', 'src'));
console.log('UI Transformation Complete.');
