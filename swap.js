const fs = require('fs');

const path = 'z:/Documentos/Projetos/MotoristAI/src/components/dashboard/PeriodSummary.tsx';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');

let perfStart = -1, perfEnd = -1;
let fatStart = -1, fatEnd = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Performance') && lines[i].includes('text-sm')) {
    // Found performance block
    perfStart = i - 2; // the div wrapper
    perfEnd = i + 7; // the end of the flex div
  }
  if (lines[i].includes('Faturamento:') && lines[i].includes('{formatCurrency(revenue)}')) {
    fatStart = i - 2; // the div wrapper
    fatEnd = i + 6; // the end of the div
  }
}

console.log('perfStart', perfStart, 'perfEnd', perfEnd);
console.log('fatStart', fatStart, 'fatEnd', fatEnd);

if (perfStart !== -1 && fatStart !== -1) {
  const perfBlock = lines.slice(perfStart, perfEnd + 1);
  const fatBlock = lines.slice(fatStart, fatEnd + 1);

  // Since Performance is before Faturamento
  if (perfStart < fatStart) {
    const beforePerf = lines.slice(0, perfStart);
    const between = lines.slice(perfEnd + 1, fatStart);
    const afterFat = lines.slice(fatEnd + 1);

    const newLines = [...beforePerf, ...fatBlock, ...between, ...perfBlock, ...afterFat];
    fs.writeFileSync(path, newLines.join('\n'));
    console.log('Swap successful');
  }
}

