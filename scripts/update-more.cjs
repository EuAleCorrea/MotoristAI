const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Buttons
    const btnRegexList = [
      /className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"/g,
      /className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"/g,
      /className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"/g,
      /className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition shadow-sm"/g
    ];

    btnRegexList.forEach(regex => {
      if (regex.test(content)) {
        content = content.replace(regex, 'className="ios-btn"');
        changed = true;
      }
    });

    // Entries toggle buttons
    const entriesBgRegex = /bg-primary-600 text-white/g;
    if (entriesBgRegex.test(content) && filePath.endsWith('Entries.tsx')) {
        content = content.replace(entriesBgRegex, 'bg-[var(--ios-accent)] text-white');
        changed = true;
    }

    // Toggle Switches
    const switchRegex = /peer-checked:bg-primary-600/g;
    if (switchRegex.test(content)) {
      content = content.replace(switchRegex, 'peer-checked:bg-[var(--ios-accent)]');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
}

const filesToUpdate = [
  'z:/Documentos/Projetos/MotoristAI/src/pages/Trips.tsx',
  'z:/Documentos/Projetos/MotoristAI/src/pages/settings/placeholders/VehiclesPage.tsx',
  'z:/Documentos/Projetos/MotoristAI/src/pages/Goals.tsx',
  'z:/Documentos/Projetos/MotoristAI/src/pages/forms/GoalFormPage.tsx',
  'z:/Documentos/Projetos/MotoristAI/src/pages/forms/family/HealthFormPage.tsx',
  'z:/Documentos/Projetos/MotoristAI/src/pages/forms/ExpenseFormPage.tsx',
  'z:/Documentos/Projetos/MotoristAI/src/pages/forms/EntryFormPage.tsx',
  'z:/Documentos/Projetos/MotoristAI/src/pages/Expenses.tsx',
  'z:/Documentos/Projetos/MotoristAI/src/pages/Entries.tsx',
  'z:/Documentos/Projetos/MotoristAI/src/components/dashboard/PeriodSummary.tsx'
];

filesToUpdate.forEach(replaceInFile);
