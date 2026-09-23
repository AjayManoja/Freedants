const fs = require('fs');
const path = require('path');

const sheetsDir = path.join(__dirname, 'mobile/src/screens/sheets');
const files = fs.readdirSync(sheetsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(sheetsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Heights & general dimensions (scaling down roughly by 1.6 - 1.8x)
  content = content.replace(/height: 52/g, 'height: 30');
  content = content.replace(/minHeight: 60/g, 'minHeight: 36');
  content = content.replace(/minHeight: 44/g, 'minHeight: 28');
  content = content.replace(/minHeight: 28/g, 'minHeight: 18');
  content = content.replace(/height: 48/g, 'height: 30');
  content = content.replace(/height: 140/g, 'height: 86');
  
  // Specific circles / boxes
  content = content.replace(/width: 72, height: 72, borderRadius: 36/g, 'width: 44, height: 44, borderRadius: 22');
  content = content.replace(/width: 44, height: 44/g, 'width: 30, height: 30');
  content = content.replace(/width: 36, height: 36/g, 'width: 22, height: 22');
  content = content.replace(/width: 20, height: 20, borderRadius: 10/g, 'width: 12, height: 12, borderRadius: 6');
  content = content.replace(/width: 10, height: 10, borderRadius: 5/g, 'width: 6, height: 6, borderRadius: 3');
  content = content.replace(/width: 48,\s*height: 48,\s*borderRadius: 24/g, 'width: 30, height: 30, borderRadius: 15');

  // Spacing adjustments
  content = content.replace(/padding: space\.lg/g, 'padding: space.md');
  content = content.replace(/marginBottom: space\.xl/g, 'marginBottom: space.lg');
  content = content.replace(/marginTop: space\.xl/g, 'marginTop: space.lg');
  content = content.replace(/marginVertical: space\.xl/g, 'marginVertical: space.lg');
  
  // Font sizes for the modal title to make it compact
  content = content.replace(/\.\.\.font\.title,/g, '...font.name, fontSize: 10,');

  fs.writeFileSync(filePath, content);
}

console.log('Scaled down sheets successfully.');
