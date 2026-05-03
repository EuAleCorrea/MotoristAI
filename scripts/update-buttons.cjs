const fs = require('fs');
const path = require('path');

const formsDir = 'z:/Documentos/Projetos/MotoristAI/src/pages/forms';

function updateFilesInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      updateFilesInDir(filePath);
    } else if (filePath.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      const searchCancel = 'className="flex-1 px-6 py-3 border border-[var(--ios-separator)] text-[var(--ios-text)] font-semibold rounded-lg hover:bg-[var(--ios-bg)] transition"';
      const replaceCancel = 'className="flex-1 ios-btn-tinted"';
      
      const searchSave = 'className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm"';
      const replaceSave = 'className="flex-1 ios-btn"';

      const searchCancel2 = "className='flex-1 px-6 py-3 border border-[var(--ios-separator)] text-[var(--ios-text)] font-semibold rounded-lg hover:bg-[var(--ios-bg)] transition'";
      const searchSave2 = "className='flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm'";

      let changed = false;
      if (content.includes(searchCancel)) {
        content = content.replaceAll(searchCancel, replaceCancel);
        changed = true;
      }
      if (content.includes(searchCancel2)) {
        content = content.replaceAll(searchCancel2, replaceCancel);
        changed = true;
      }
      if (content.includes(searchSave)) {
        content = content.replaceAll(searchSave, replaceSave);
        changed = true;
      }
      if (content.includes(searchSave2)) {
        content = content.replaceAll(searchSave2, replaceSave);
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
      }
    }
  }
}

updateFilesInDir(formsDir);

// Also do vehicles settings page
const vehPage = 'z:/Documentos/Projetos/MotoristAI/src/pages/settings/placeholders/VehiclesPage.tsx';
if (fs.existsSync(vehPage)) {
    let content = fs.readFileSync(vehPage, 'utf8');
    const searchCancel = 'className="flex-1 px-6 py-3 border border-[var(--ios-separator)] text-[var(--ios-text)] font-semibold rounded-lg hover:bg-[var(--ios-bg)] transition"';
    const replaceCancel = 'className="flex-1 ios-btn-tinted"';
    const searchSave = 'className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm"';
    const replaceSave = 'className="flex-1 ios-btn"';
    let changed = false;
    if (content.includes(searchCancel)) { content = content.replaceAll(searchCancel, replaceCancel); changed = true; }
    if (content.includes(searchSave)) { content = content.replaceAll(searchSave, replaceSave); changed = true; }
    if (changed) {
        fs.writeFileSync(vehPage, content, 'utf8');
        console.log(`Updated: ${vehPage}`);
    }
}
