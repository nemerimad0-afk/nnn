const fs = require('fs');
let content = fs.readFileSync('src/UserMenu.tsx', 'utf8');
content = content.replace(/970569716164/g, '972598467629');
// Fix footer icon specifically
content = content.replace(/<Share2 size=\{17\} \/>/g, '<MessageCircle size={17} />');
fs.writeFileSync('src/UserMenu.tsx', content);
