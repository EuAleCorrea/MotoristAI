import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface EntryData {
  date: string;
  source: string;
  value: number;
  tripCount: number;
  kmDriven: number;
  hoursWorked: string;
  notes?: string;
}

interface ExpenseData {
  date: string;
  category: string;
  description: string;
  amount: number;
}

interface ReportFilters {
  startDate: Date;
  endDate: Date;
  driverName?: string;
  document?: string;
}

/**
 * Gera um PDF de comprovação de renda para motoristas de aplicativo.
 * Formato profissional com logo, dados do motorista, resumo financeiro
 * e detalhamento mensal de receitas e despesas.
 */
export function generateIncomeReport(
  entries: EntryData[],
  expenses: ExpenseData[],
  filters: ReportFilters
): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 20;
  const marginRight = 20;
  const contentWidth = pageWidth - marginLeft - marginRight;
  let y = 20;

  // ─── Cores ───
  const primaryColor: [number, number, number] = [37, 99, 235]; // Azul
  const secondaryColor: [number, number, number] = [100, 116, 139]; // Slate
  const successColor: [number, number, number] = [22, 163, 74]; // Verde
  const dangerColor: [number, number, number] = [220, 38, 38]; // Vermelho
  const textColor: [number, number, number] = [30, 41, 59]; // Slate-800
  const lightGray: [number, number, number] = [241, 245, 249]; // Slate-100
  const mediumGray: [number, number, number] = [148, 163, 184]; // Slate-400

  // ─── Helpers ───
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const addHeader = () => {
    // Barra superior azul
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 8, 'F');

    // Título principal
    doc.setFontSize(20);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('Comprovante de Renda', pageWidth / 2, y, { align: 'center' });
    y += 7;

    // Subtítulo
    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text('Documento gerado para comprovação de renda como motorista de aplicativo', pageWidth / 2, y, { align: 'center' });
    y += 12;

    // Linha separadora
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, y, pageWidth - marginRight, y);
    y += 8;
  };

  const addSectionTitle = (title: string) => {
    doc.setFillColor(...lightGray);
    doc.rect(marginLeft, y, contentWidth, 8, 'F');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(title, marginLeft + 4, y + 6);
    y += 12;
  };

  const addField = (label: string, value: string, x: number, width: number) => {
    doc.setFontSize(8);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x, y);

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x, y + 4);
  };

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - 25) {
      addFooter();
      doc.addPage();
      y = 20;
      addHeader();
    }
  };

  const addFooter = () => {
    const footerY = pageHeight - 10;
    doc.setFontSize(7);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Gerado em ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}`,
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );
    doc.text(
      `MotoristAI - Gestão Financeira para Motoristas`,
      pageWidth / 2,
      footerY + 4,
      { align: 'center' }
    );
  };

  // ════════════════════════════════════════
  // HEADER
  // ════════════════════════════════════════
  addHeader();

  // ════════════════════════════════════════
  // DADOS DO MOTORISTA
  // ════════════════════════════════════════
  addSectionTitle('Dados do Motorista');

  addField('Nome', filters.driverName || 'Não informado', marginLeft, contentWidth * 0.5);
  if (filters.document) {
    addField('CPF/CNPJ', filters.document, marginLeft + contentWidth * 0.5, contentWidth * 0.5);
  }
  y += 10;

  addField('Período', `${format(filters.startDate, 'dd/MM/yyyy', { locale: ptBR })} a ${format(filters.endDate, 'dd/MM/yyyy', { locale: ptBR })}`, marginLeft, contentWidth * 0.5);
  y += 10;

  // ════════════════════════════════════════
  // RESUMO FINANCEIRO
  // ════════════════════════════════════════
  checkPageBreak(40);
  addSectionTitle('Resumo Financeiro do Período');

  const totalRevenue = entries.reduce((sum, e) => sum + e.value, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalTrips = entries.reduce((sum, e) => sum + e.tripCount, 0);
  const totalKm = entries.reduce((sum, e) => sum + e.kmDriven, 0);
  const avgPerTrip = totalTrips > 0 ? totalRevenue / totalTrips : 0;
  const avgPerDay = entries.length > 0 ? totalRevenue / entries.length : 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Cards de resumo
  const cardWidth = (contentWidth - 12) / 3;
  const cardY = y;

  const drawCard = (x: number, label: string, value: string, color: [number, number, number], bgColor: [number, number, number]) => {
    doc.setFillColor(...bgColor);
    doc.setDrawColor(...color);
    doc.roundedRect(x, cardY, cardWidth, 18, 2, 2, 'FD');

    doc.setFontSize(7);
    doc.setTextColor(...color);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x + cardWidth / 2, cardY + 6, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x + cardWidth / 2, cardY + 14, { align: 'center' });
  };

  drawCard(marginLeft, 'Receita Total', formatCurrency(totalRevenue), successColor, [240, 255, 244]);
  drawCard(marginLeft + cardWidth + 6, 'Despesas Totais', formatCurrency(totalExpenses), dangerColor, [255, 245, 245]);
  drawCard(marginLeft + (cardWidth + 6) * 2, 'Lucro Líquido', formatCurrency(totalProfit), totalProfit >= 0 ? successColor : dangerColor, [239, 246, 255]);

  y = cardY + 22;

  // Métricas adicionais
  checkPageBreak(25);
  doc.setFillColor(...lightGray);
  doc.rect(marginLeft, y, contentWidth, 1, 'F');
  y += 6;

  const metrics = [
    { label: 'Total de Corridas', value: totalTrips.toString() },
    { label: 'KM Rodados', value: `${totalKm.toLocaleString('pt-BR')} km` },
    { label: 'Média por Corrida', value: formatCurrency(avgPerTrip) },
    { label: 'Média por Dia', value: formatCurrency(avgPerDay) },
    { label: 'Margem de Lucro', value: `${profitMargin.toFixed(1)}%` },
    { label: 'Dias com Registro', value: entries.length.toString() },
  ];

  const metricWidth = contentWidth / 3;
  metrics.forEach((metric, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = marginLeft + col * metricWidth;
    const my = y + row * 12;

    doc.setFontSize(7);
    doc.setTextColor(...mediumGray);
    doc.setFont('helvetica', 'normal');
    doc.text(metric.label, x, my);

    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.setFont('helvetica', 'bold');
    doc.text(metric.value, x, my + 5);
  });

  y += 30;

  // ════════════════════════════════════════
  // RECEITAS POR MÊS
  // ════════════════════════════════════════
  checkPageBreak(60);
  addSectionTitle('Detalhamento Mensal de Receitas');

  // Agrupar entradas por mês
  const entriesByMonth = entries.reduce((acc, entry) => {
    const monthKey = format(new Date(entry.date), 'yyyy-MM');
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(entry);
    return acc;
  }, {} as Record<string, EntryData[]>);

  // Ordenar meses
  const sortedMonths = Object.keys(entriesByMonth).sort();

  // Cabeçalho da tabela
  const tableY = y;
  const colWidths = [38, 30, 30, 25, 25, contentWidth - 148];
  const headers = ['Mês', 'Receita', 'Corridas', 'KM', 'Méd./Corrida', 'Plataformas'];

  doc.setFillColor(...primaryColor);
  doc.rect(marginLeft, tableY, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');

  let hx = marginLeft;
  headers.forEach((header, i) => {
    doc.text(header, hx + 1, tableY + 4.5);
    hx += colWidths[i];
  });

  y = tableY + 9;

  // Linhas da tabela
  let totalMonthRevenue = 0;
  let totalMonthTrips = 0;
  let totalMonthKm = 0;

  sortedMonths.forEach((monthKey, idx) => {
    const monthEntries = entriesByMonth[monthKey];
    const monthRevenue = monthEntries.reduce((s, e) => s + e.value, 0);
    const monthTrips = monthEntries.reduce((s, e) => s + e.tripCount, 0);
    const monthKm = monthEntries.reduce((s, e) => s + e.kmDriven, 0);
    const monthAvg = monthTrips > 0 ? monthRevenue / monthTrips : 0;

    // Plataformas únicas
    const platforms = [...new Set(monthEntries.map(e => e.source))].join(', ');

    totalMonthRevenue += monthRevenue;
    totalMonthTrips += monthTrips;
    totalMonthKm += monthKm;

    checkPageBreak(8);

    if (idx % 2 === 0) {
      doc.setFillColor(...lightGray);
      doc.rect(marginLeft, y - 1.5, contentWidth, 7, 'F');
    }

    doc.setTextColor(...textColor);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');

    const rowData = [
      format(new Date(monthKey + '-01'), 'MMM/yy', { locale: ptBR }),
      formatCurrency(monthRevenue),
      monthTrips.toString(),
      `${monthKm.toLocaleString('pt-BR')} km`,
      formatCurrency(monthAvg),
      platforms,
    ];

    hx = marginLeft;
    rowData.forEach((val, i) => {
      doc.text(val, hx + 1, y + 1.5);
      hx += colWidths[i];
    });

    y += 8;
  });

  // Linha de total
  checkPageBreak(8);
  doc.setFillColor(...primaryColor);
  doc.rect(marginLeft, y - 1.5, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);

  const totalRow = [
    'Total',
    formatCurrency(totalMonthRevenue),
    totalMonthTrips.toString(),
    `${totalMonthKm.toLocaleString('pt-BR')} km`,
    formatCurrency(totalMonthTrips > 0 ? totalMonthRevenue / totalMonthTrips : 0),
    '',
  ];

  hx = marginLeft;
  totalRow.forEach((val, i) => {
    doc.text(val, hx + 1, y + 1.5);
    hx += colWidths[i];
  });

  y += 14;

  // ════════════════════════════════════════
  // DESPESAS POR CATEGORIA
  // ════════════════════════════════════════
  if (expenses.length > 0) {
    checkPageBreak(40);

    const expensesByCategory = expenses.reduce((acc, exp) => {
      if (!acc[exp.category]) acc[exp.category] = 0;
      acc[exp.category] += exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a);

    addSectionTitle('Despesas por Categoria');

    // Bar chart horizontal
    const maxExpense = Math.max(...sortedCategories.map(([, v]) => v), 1);
    const barMaxWidth = contentWidth - 100;
    const barHeight = 6;
    const barGap = 3;

    sortedCategories.forEach(([category, amount], idx) => {
      checkPageBreak(barHeight + barGap + 10);

      doc.setFontSize(8);
      doc.setTextColor(...textColor);
      doc.setFont('helvetica', 'normal');
      doc.text(category, marginLeft, y + 3);

      doc.setFontSize(8);
      doc.setTextColor(...mediumGray);
      doc.text(formatCurrency(amount), marginLeft + barMaxWidth + 2, y + 3);

      const barWidth = (amount / maxExpense) * barMaxWidth;
      const barColor: [number, number, number] = idx % 2 === 0 ? primaryColor : [96, 165, 250];
      doc.setFillColor(...barColor);
      doc.roundedRect(marginLeft, y + 5, barWidth, barHeight, 1, 1, 'F');

      y += barHeight + barGap + 8;
    });

    y += 8;
  }

  // ════════════════════════════════════════
  // DECLARAÇÃO
  // ════════════════════════════════════════
  checkPageBreak(40);
  addSectionTitle('Declaração');

  const declarationY = y;
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'normal');

  const declarationText = [
    `Declaro para os devidos fins que as informações contidas neste documento são`,
    `verdadeiras e refletem a realidade dos rendimentos obtidos como motorista de`,
    `aplicativo no período de ${format(filters.startDate, 'dd/MM/yyyy')} a ${format(filters.endDate, 'dd/MM/yyyy')}.`,
    '',
    `Este documento foi gerado automaticamente pelo aplicativo MotoristAI com base`,
    `nos registros financeiros inseridos pelo usuário.`,
  ];

  declarationText.forEach((line) => {
    doc.text(line, marginLeft, y);
    y += 5;
  });

  y += 15;

  // Linha de assinatura
  doc.setDrawColor(...secondaryColor);
  doc.line(marginLeft, y, marginLeft + 60, y);
  doc.setFontSize(9);
  doc.setTextColor(...secondaryColor);
  doc.setFont('helvetica', 'normal');
  doc.text('Assinatura do Motorista', marginLeft, y + 5);

  // Data do documento
  doc.setFontSize(9);
  doc.setTextColor(...textColor);
  doc.text(
    `${filters.driverName ? filters.driverName + ', ' : ''}${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`,
    pageWidth - marginRight - 60,
    y,
    { align: 'right' }
  );

  // ════════════════════════════════════════
  // FOOTER
  // ════════════════════════════════════════
  addFooter();

  return doc;
}