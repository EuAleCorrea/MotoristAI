import {
  eachWeekOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const getWeeklyIntervals = (date: Date, monthsAgo: number) => {
  const endDate = endOfDay(date);
  const startDate = startOfDay(subMonths(endDate, monthsAgo));

  const weeks = eachWeekOfInterval(
    {
      start: startDate,
      end: endDate,
    },
    { weekStartsOn: 1 } // Começa na Segunda-feira
  );

  return weeks.reverse().map(weekStartDate => {
    const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 1 });
    return { start: weekStartDate, end: weekEndDate };
  });
};

export const formatWeekInterval = (start: Date, end: Date) => {
  const startMonth = format(start, 'MMM', { locale: ptBR });
  const endMonth = format(end, 'MMM', { locale: ptBR });

  if (startMonth === endMonth) {
    return `${format(start, 'd')} - ${format(end, 'd \'de\' MMMM', { locale: ptBR })}`;
  }
  return `${format(start, 'd \'de\' MMM', { locale: ptBR })}. - ${format(end, 'd \'de\' MMM', { locale: ptBR })}.`;
};

export const getMonthInterval = (year: number, month: number) => {
    const date = new Date(year, month - 1);
    return {
        start: startOfMonth(date),
        end: endOfMonth(date),
    };
};

export const getYearInterval = (year: number) => {
    const date = new Date(year, 0);
    return {
        start: startOfYear(date),
        end: endOfYear(date),
    };
};
