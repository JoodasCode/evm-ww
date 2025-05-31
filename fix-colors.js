import fs from 'fs';

// Files to update
const files = [
  'client/src/components/dashboard/tabs/InsightsTab.tsx',
  'client/src/components/dashboard/tabs/PsychoanalyticsTab.tsx'
];

// Color replacements
const colorReplacements = [
  // Icon backgrounds and rings
  { from: /bg-red-500\/10 ring-1 ring-red-500\/20/g, to: 'bg-muted ring-1 ring-border' },
  { from: /bg-blue-500\/10 ring-1 ring-blue-500\/20/g, to: 'bg-muted ring-1 ring-border' },
  { from: /bg-green-500\/10 ring-1 ring-green-500\/20/g, to: 'bg-muted ring-1 ring-border' },
  { from: /bg-purple-500\/10 ring-1 ring-purple-500\/20/g, to: 'bg-muted ring-1 ring-border' },
  { from: /bg-yellow-500\/10 ring-1 ring-yellow-500\/20/g, to: 'bg-muted ring-1 ring-border' },
  { from: /bg-orange-500\/10 ring-1 ring-orange-500\/20/g, to: 'bg-muted ring-1 ring-border' },
  
  // Icon colors
  { from: /text-red-400/g, to: 'text-muted-foreground' },
  { from: /text-blue-400/g, to: 'text-muted-foreground' },
  { from: /text-green-400/g, to: 'text-muted-foreground' },
  { from: /text-purple-400/g, to: 'text-muted-foreground' },
  { from: /text-yellow-400/g, to: 'text-muted-foreground' },
  { from: /text-orange-400/g, to: 'text-muted-foreground' },
  
  // Badge colors
  { from: /bg-red-500\/10 text-red-400 border-red-500\/20/g, to: 'bg-muted text-muted-foreground border-border' },
  { from: /bg-blue-500\/10 text-blue-400 border-blue-500\/20/g, to: 'bg-muted text-muted-foreground border-border' },
  { from: /bg-green-500\/10 text-green-400 border-green-500\/20/g, to: 'bg-muted text-muted-foreground border-border' },
  { from: /bg-purple-500\/10 text-purple-400 border-purple-500\/20/g, to: 'bg-muted text-muted-foreground border-border' },
  { from: /bg-yellow-500\/10 text-yellow-400 border-yellow-500\/20/g, to: 'bg-muted text-muted-foreground border-border' },
  { from: /bg-orange-500\/10 text-orange-400 border-orange-500\/20/g, to: 'bg-muted text-muted-foreground border-border' },
  
  // Background colors
  { from: /bg-red-500\/10/g, to: 'bg-muted' },
  { from: /bg-blue-500\/10/g, to: 'bg-muted' },
  { from: /bg-green-500\/10/g, to: 'bg-muted' },
  { from: /bg-purple-500\/10/g, to: 'bg-muted' },
  { from: /bg-yellow-500\/10/g, to: 'bg-muted' },
  { from: /bg-orange-500\/10/g, to: 'bg-muted' },
  
  // Border colors
  { from: /border-red-500\/20/g, to: 'border-border' },
  { from: /border-blue-500\/20/g, to: 'border-border' },
  { from: /border-green-500\/20/g, to: 'border-border' },
  { from: /border-purple-500\/20/g, to: 'border-border' },
  { from: /border-yellow-500\/20/g, to: 'border-border' },
  { from: /border-orange-500\/20/g, to: 'border-border' },
  
  // Progress bars and fills
  { from: /bg-red-500/g, to: 'bg-primary' },
  { from: /bg-blue-500/g, to: 'bg-primary' },
  { from: /bg-green-500/g, to: 'bg-primary' },
  { from: /bg-purple-500/g, to: 'bg-primary' },
  { from: /bg-yellow-500/g, to: 'bg-primary' },
  { from: /bg-orange-500/g, to: 'bg-primary' },
  
  // Gradients
  { from: /bg-gradient-to-r from-purple-500 to-purple-400/g, to: 'bg-primary' },
  { from: /bg-gradient-to-r from-emerald-500\/5 to-blue-500\/5/g, to: 'bg-muted/50' }
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    colorReplacements.forEach(replacement => {
      content = content.replace(replacement.from, replacement.to);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated colors in ${filePath}`);
  }
});

console.log('Color standardization complete!');