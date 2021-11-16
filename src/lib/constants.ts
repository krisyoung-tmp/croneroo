import { ExpressionType } from './types';

export const EXPRESSION_MAP: ExpressionType[] = [
  'minute',
  'hour',
  'dayOfMonth',
  'month',
  'dayOfWeek',
];

export const FIELD_NAME_MAP: Record<string, string> = {
  minute: 'minute',
  hour: 'hour',
  dayOfMonth: 'day of month',
  month: 'month',
  dayOfWeek: 'day of week',
};

export const CONSTRAINTS = [
  { min: 0, max: 59 },
  { min: 0, max: 23 },
  { min: 1, max: 31 },
  { min: 1, max: 12 },
  { min: 0, max: 6 },
];

export const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const ALIASES: Record<
  Extract<ExpressionType, 'month' | 'dayOfWeek'>,
  Record<string, number>
> = {
  month: {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  },
  dayOfWeek: {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  },
};

export const VALID_CHARS = {
  second: /^[\d|/|*|\-|,]+$/,
  minute: /^[\d|/|*|\-|,]+$/,
  hour: /^[\d|/|*|\-|,]+$/,
  dayOfMonth: /^[\d|L|/|*|\-|,|?]+$/,
  month: /^[\d|/|*|\-|,]+$/,
  dayOfWeek: /^[\d|\dL|/|*|\-|,|?]+$/,
};
