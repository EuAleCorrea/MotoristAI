import { useMemo } from 'react';
import { useEntryStore } from '../store/entryStore';
import { useExpenseStore } from '../store/expenseStore';
import { useVehicleExpensesStore } from '../store/vehicleExpensesStore';
import { useFamilyExpensesStore } from '../store/familyExpensesStore';
import { useGoalStore } from '../store/goalStore';
import { usePlatformStore } from '../store/platformStore';
import { hhmmToHours } from '../utils/dateHelpers';
import {
  startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  subWeeks, subMonths, eachDayOfInterval, format, getDaysInMonth, differenceInCalendarDays,
  isAfter, isBefore, isEqual, getDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type PeriodType = 'hoje' | 'semana' | 'mes';

function getDateRange(period: PeriodType) {
  const now = new Date();
  switch (period) {
    case 'hoje': return { start: startOfDay(now), end: endOfDay(now) };
    case 'semana': return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    case 'mes': return { start: startOfMonth(now), end: endOfMonth(now) };
  }
}

function getPreviousRange(period: PeriodType) {
  const now = new Date();
  switch (period) {
    case 'hoje': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    }
    case 'semana': {
      const prevStart = subWeeks(startOfWeek(now, { weekStartsOn: 1 }), 1);
      return { start: prevStart, end: endOfWeek(prevStart, { weekStartsOn: 1 }) };
    }
    case 'mes': {
      const prevMonth = subMonths(startOfMonth(now), 1);
      return { start: prevMonth, end: endOfMonth(prevMonth) };
    }
  }
}

function inRange(dateStr: string, start: Date, end: Date) {
  const d = new Date(dateStr);
  return (isAfter(d, start) || isEqual(d, start)) && (isBefore(d, end) || isEqual(d, end));
}

export function useInsightsData(period: PeriodType) {
  const entries = useEntryStore(s => s.entries);
  const expenses = useExpenseStore(s => s.expenses);
  const vehicleExpenses = useVehicleExpensesStore(s => s.expenses);
  const familyExpenses = useFamilyExpensesStore(s => s.expenses);
  const goals = useGoalStore(s => s.goals);
  const platforms = usePlatformStore(s => s.platforms);

  return useMemo(() => {
    const now = new Date();
    const { start, end } = getDateRange(period);
    const prev = getPreviousRange(period);

    // --- Filter data by period ---
    const pEntries = entries.filter(e => inRange(e.date, start, end));
    const pExpenses = expenses.filter(e => inRange(e.date, start, end));
    const pVehicleExp = vehicleExpenses.filter(e => inRange(e.date, start, end));
    const pFamilyExp = familyExpenses.filter(e => e.date && inRange(e.date, start, end));

    const prevEntries = entries.filter(e => inRange(e.date, prev.start, prev.end));
    const prevExpenses = expenses.filter(e => inRange(e.date, prev.start, prev.end));
    const prevVehicleExp = vehicleExpenses.filter(e => inRange(e.date, prev.start, prev.end));
    const prevFamilyExp = familyExpenses.filter(e => e.date && inRange(e.date, prev.start, prev.end));

    // --- Summary ---
    const faturamento = pEntries.reduce((s, e) => s + e.value, 0);
    const despesasGerais = pExpenses.reduce((s, e) => s + e.amount, 0);
    const despesasVeiculo = pVehicleExp.reduce((s, e) => s + e.totalValue, 0);
    const despesasFamilia = pFamilyExp.reduce((s, e) => s + e.totalValue, 0);
    const despesas = despesasGerais + despesasVeiculo + despesasFamilia;
    const lucro = faturamento - despesas;

    const totalViagens = pEntries.reduce((s, e) => s + e.tripCount, 0);
    const horasTrabalhadas = pEntries.reduce((s, e) => s + hhmmToHours(e.hoursWorked), 0);
    const kmRodados = pEntries.reduce((s, e) => s + e.kmDriven, 0);
    const rsHora = horasTrabalhadas > 0 ? faturamento / horasTrabalhadas : 0;

    // --- Previous period ---
    const prevFat = prevEntries.reduce((s, e) => s + e.value, 0);
    const prevDespTotal = prevExpenses.reduce((s, e) => s + e.amount, 0)
      + prevVehicleExp.reduce((s, e) => s + e.totalValue, 0)
      + prevFamilyExp.reduce((s, e) => s + e.totalValue, 0);
    const prevLucro = prevFat - prevDespTotal;
    const prevViagens = prevEntries.reduce((s, e) => s + e.tripCount, 0);
    const prevHoras = prevEntries.reduce((s, e) => s + hhmmToHours(e.hoursWorked), 0);
    const prevRsHora = prevHoras > 0 ? prevFat / prevHoras : 0;
    const prevTicket = prevViagens > 0 ? prevFat / prevViagens : 0;

    // --- Goal ---
    const currentGoal = goals.find(g => g.year === now.getFullYear() && g.month === now.getMonth() + 1);
    const metaMensal = currentGoal?.profit ?? currentGoal?.revenue ?? 0;
    const daysInMonth = getDaysInMonth(now);
    const today = now.getDate();
    const diasRestantes = Math.max(0, daysInMonth - today);
    const daysWithEntries = new Set(pEntries.map(e => format(new Date(e.date), 'yyyy-MM-dd'))).size;
    const diasTrabalhados = daysWithEntries || 1;
    const diasPlanejados = currentGoal?.daysWorkedPerWeek
      ? Math.round(currentGoal.daysWorkedPerWeek * (daysInMonth / 7))
      : daysInMonth;

    // --- Meta progress (monthly context) ---
    const monthEntries = entries.filter(e => inRange(e.date, startOfMonth(now), endOfMonth(now)));
    const monthExpenses = expenses.filter(e => inRange(e.date, startOfMonth(now), endOfMonth(now)));
    const monthVExp = vehicleExpenses.filter(e => inRange(e.date, startOfMonth(now), endOfMonth(now)));
    const monthFExp = familyExpenses.filter(e => e.date && inRange(e.date, startOfMonth(now), endOfMonth(now)));
    const monthFat = monthEntries.reduce((s, e) => s + e.value, 0);
    const monthDesp = monthExpenses.reduce((s, e) => s + e.amount, 0) + monthVExp.reduce((s, e) => s + e.totalValue, 0) + monthFExp.reduce((s, e) => s + e.totalValue, 0);
    const monthLucro = monthFat - monthDesp;
    const monthDaysTrabalhados = new Set(monthEntries.map(e => format(new Date(e.date), 'yyyy-MM-dd'))).size || 1;
    const projecaoMensal = (monthLucro / monthDaysTrabalhados) * diasPlanejados;
    const necessarioDia = diasRestantes > 0 ? (metaMensal - monthLucro) / diasRestantes : 0;
    const metaPercentual = metaMensal > 0 ? (monthLucro / metaMensal) * 100 : 0;

    // --- Evolução diária ---
    const allDays = eachDayOfInterval({ start, end });
    const evolucaoDiaria = allDays.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayEntries = pEntries.filter(e => format(new Date(e.date), 'yyyy-MM-dd') === dayStr);
      const dayExpenses = pExpenses.filter(e => format(new Date(e.date), 'yyyy-MM-dd') === dayStr);
      const dayVExp = pVehicleExp.filter(e => format(new Date(e.date), 'yyyy-MM-dd') === dayStr);
      const dayRev = dayEntries.reduce((s, e) => s + e.value, 0);
      const dayDesp = dayExpenses.reduce((s, e) => s + e.amount, 0) + dayVExp.reduce((s, e) => s + e.totalValue, 0);
      const realizado = !isAfter(day, now);
      return {
        dia: period === 'mes' ? format(day, 'd') : format(day, 'EEE', { locale: ptBR }).substring(0, 3),
        diaFull: dayStr,
        lucro: dayRev - dayDesp,
        faturamento: dayRev,
        realizado,
      };
    });

    // --- Tendência R$/hora por dia ---
    const tendencia = allDays.filter(d => !isAfter(d, now)).map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayEntries = pEntries.filter(e => format(new Date(e.date), 'yyyy-MM-dd') === dayStr);
      const dayRev = dayEntries.reduce((s, e) => s + e.value, 0);
      const dayHrs = dayEntries.reduce((s, e) => s + hhmmToHours(e.hoursWorked), 0);
      return { dia: format(day, 'd'), rsHora: dayHrs > 0 ? dayRev / dayHrs : 0 };
    }).filter(t => t.rsHora > 0);

    // --- Por plataforma ---
    const platformMap: Record<string, { faturamento: number; horas: number; corridas: number }> = {};
    pEntries.forEach(e => {
      const key = e.source || 'Outro';
      if (!platformMap[key]) platformMap[key] = { faturamento: 0, horas: 0, corridas: 0 };
      platformMap[key].faturamento += e.value;
      platformMap[key].horas += hhmmToHours(e.hoursWorked);
      platformMap[key].corridas += e.tripCount;
    });
    const plataformas = Object.entries(platformMap).map(([nome, data]) => {
      const plat = platforms.find(p => p.name === nome);
      const colorMap: Record<string, string> = { 'Uber': '#1DB954', '99': '#facc15', 'InDriver': '#8b5cf6' };
      return {
        nome,
        cor: colorMap[nome] || plat?.color || '#6366f1',
        faturamento: data.faturamento,
        rsHora: data.horas > 0 ? data.faturamento / data.horas : 0,
        corridas: data.corridas,
        corridasPorHora: data.horas > 0 ? data.corridas / data.horas : 0,
      };
    }).sort((a, b) => b.faturamento - a.faturamento);

    // --- Custos por tipo ---
    const fuelCost = pVehicleExp.filter(e => e.type === 'fuel').reduce((s, e) => s + e.totalValue, 0);
    const depCost = pVehicleExp.filter(e => e.type === 'depreciation').reduce((s, e) => s + e.totalValue, 0);
    const maintCost = pVehicleExp.filter(e => e.type === 'maintenance').reduce((s, e) => s + e.totalValue, 0);
    const otherCost = pVehicleExp.filter(e => !['fuel', 'depreciation', 'maintenance'].includes(e.type)).reduce((s, e) => s + e.totalValue, 0)
      + despesasGerais + despesasFamilia;
    const custoKm = kmRodados > 0 ? despesas / kmRodados : 0;

    // --- Comparativo ---
    const ticketMedio = totalViagens > 0 ? faturamento / totalViagens : 0;
    const varLucro = prevLucro > 0 ? ((lucro - prevLucro) / prevLucro) * 100 : 0;
    const varRsHora = prevRsHora > 0 ? ((rsHora - prevRsHora) / prevRsHora) * 100 : 0;
    const varViagens = prevViagens > 0 ? totalViagens - prevViagens : 0;
    const varTicket = prevTicket > 0 ? ((ticketMedio - prevTicket) / prevTicket) * 100 : 0;
    const varDespesas = prevDespTotal > 0 ? ((despesas - prevDespTotal) / prevDespTotal) * 100 : 0;

    // --- Break-even ---
    const todayEntries = entries.filter(e => inRange(e.date, startOfDay(now), endOfDay(now)));
    const todayExp = expenses.filter(e => inRange(e.date, startOfDay(now), endOfDay(now)));
    const todayVExp = vehicleExpenses.filter(e => inRange(e.date, startOfDay(now), endOfDay(now)));
    const breakEven = todayExp.reduce((s, e) => s + e.amount, 0) + todayVExp.reduce((s, e) => s + e.totalValue, 0);
    const todayTrips = todayEntries.reduce((s, e) => s + e.tripCount, 0);
    const lucroPorCorridaExtra = todayTrips > 0
      ? todayEntries.reduce((s, e) => s + e.value, 0) / todayTrips
      : ticketMedio;

    // --- Corridas/hora e tempo médio ---
    const corridasPorHora = horasTrabalhadas > 0 ? totalViagens / horasTrabalhadas : 0;
    const tempoMedioCorrida = totalViagens > 0 ? (horasTrabalhadas * 60) / totalViagens : 0;

    // --- Score (heurística) ---
    let score = 50;
    if (rsHora >= 40) score += 15; else if (rsHora >= 30) score += 10; else if (rsHora >= 20) score += 5;
    if (corridasPorHora >= 2.5) score += 10; else if (corridasPorHora >= 1.5) score += 5;
    if (metaPercentual >= 100) score += 15; else if (metaPercentual >= 70) score += 10; else if (metaPercentual >= 40) score += 5;
    if (varLucro > 10) score += 10; else if (varLucro > 0) score += 5;
    score = Math.min(100, Math.max(0, score));
    const scoreClass = score >= 86 ? 'Expert' : score >= 66 ? 'Ótimo' : score >= 41 ? 'Bom' : 'Iniciante';

    // --- Alertas ---
    type AlertType = { titulo: string; descricao: string; tipo: 'sucesso' | 'atencao' | 'perigo' | 'info'; emoji: string };
    const alertas: AlertType[] = [];
    if (varDespesas > 20) {
      alertas.push({ titulo: 'Despesas subiram ' + Math.round(varDespesas) + '%', descricao: 'Vs período anterior. Fique atento aos gastos.', tipo: 'perigo', emoji: '⛽' });
    }
    if (metaMensal > 0 && projecaoMensal < metaMensal) {
      const diff = metaMensal - projecaoMensal;
      alertas.push({ titulo: 'Meta em risco', descricao: `No ritmo atual, você fecha R$${Math.round(diff)} abaixo da meta. Precisa de R$${Math.round(necessarioDia)}/dia nos ${diasRestantes} dias restantes.`, tipo: 'atencao', emoji: '🎯' });
    }
    if (plataformas.length >= 2) {
      const sorted = [...plataformas].sort((a, b) => b.rsHora - a.rsHora);
      const diff = sorted[0].rsHora - sorted[sorted.length - 1].rsHora;
      if (diff / (sorted[0].rsHora || 1) > 0.3) {
        alertas.push({ titulo: `${sorted[0].nome} mais eficiente`, descricao: `R$${sorted[0].rsHora.toFixed(0)}/h vs R$${sorted[sorted.length - 1].rsHora.toFixed(0)}/h no ${sorted[sorted.length - 1].nome}.`, tipo: 'info', emoji: '📊' });
      }
    }
    if (metaMensal > 0 && projecaoMensal >= metaMensal) {
      alertas.push({ titulo: 'Meta no caminho!', descricao: `Projeção de R$${Math.round(projecaoMensal)} — acima da meta.`, tipo: 'sucesso', emoji: '🚀' });
    }

    const scoreTags: { texto: string; tipo: 'positivo' | 'atencao' | 'negativo' }[] = [];
    if (rsHora >= 30) scoreTags.push({ texto: 'Alta eficiência/hora', tipo: 'positivo' });
    if (corridasPorHora >= 2) scoreTags.push({ texto: 'Bom volume de corridas', tipo: 'positivo' });
    if (varLucro < -10) scoreTags.push({ texto: 'Lucro em queda', tipo: 'negativo' });
    if (varDespesas > 20) scoreTags.push({ texto: 'Despesas em alta', tipo: 'negativo' });
    if (metaPercentual >= 80) scoreTags.push({ texto: 'Meta bem encaminhada', tipo: 'positivo' });

    return {
      faturamento, despesas, lucro, rsHora, totalViagens, horasTrabalhadas, kmRodados,
      ticketMedio, custoKm, corridasPorHora, tempoMedioCorrida,
      metaMensal, metaPercentual, monthLucro, diasRestantes, diasTrabalhados: monthDaysTrabalhados, diasPlanejados,
      necessarioDia, projecaoMensal,
      evolucaoDiaria, tendencia, plataformas,
      fuelCost, depCost, maintCost, otherCost,
      breakEven, lucroPorCorridaExtra,
      prevLucro, prevRsHora, prevViagens, prevTicket, prevDespesas: prevDespTotal,
      varLucro, varRsHora, varViagens, varTicket, varDespesas,
      score, scoreClass, scoreTags, alertas,
      hasEnoughData: pEntries.length >= 1,
    };
  }, [entries, expenses, vehicleExpenses, familyExpenses, goals, platforms, period]);
}
