import { ALIASES, DAYS_IN_MONTH } from './constants';
import {
  InvalidDayOfMonthException,
  InvalidFieldRangeException,
  UnknownAliasException,
} from './errors';
import { ExpressionType, FieldConstraint, MappedExpression } from './types';

export function range(start: number, end: number) {
  if (end < start) {
    throw new InvalidFieldRangeException(start, end);
  }
  const length = end - start + 1;
  return Array.from({ length }).map((_, idx) => start + idx);
}

export function normalizeAliases(field: ExpressionType, str: string) {
  if (field === 'month' || field === 'dayOfWeek') {
    const aliasMap = ALIASES[field];
    return str.replace(/[a-z]{3}/gi, (match) => {
      const result = aliasMap[match.toLowerCase()];
      if (!result) throw new UnknownAliasException(field, match);
      return `${result}`;
    });
  }
  return str;
}

export function normalizeSpecialTokens(
  str: string,
  constraints: FieldConstraint
) {
  return str.replace(/\*|\?/g, constraints.min + '-' + constraints.max);
}

export function clampDaysInMonth(fields: MappedExpression): MappedExpression {
  if (fields.month.length === 1) {
    const month = fields.month[0];
    const dayOfMonth = fields.dayOfMonth[0];
    const daysInMonth = DAYS_IN_MONTH[month - 1];
    if (dayOfMonth > daysInMonth) {
      throw new InvalidDayOfMonthException(dayOfMonth, daysInMonth, month);
    }

    return {
      ...fields,
      dayOfMonth: fields.dayOfMonth.filter((value) => value <= daysInMonth),
    };
  }
  return fields;
}
