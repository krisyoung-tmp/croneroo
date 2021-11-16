import { ALIASES } from './constants';
import { FieldConstraint } from './types';

export class InvalidFieldRangeException extends Error {
  constructor(start: number, end: number) {
    super();
    this.message = `InvalidFieldRangeException: start value must be before end value; received '${start}-${end}'.`;
  }
}

export class ExpressionLengthException extends Error {
  constructor(length: number) {
    super();
    this.message = `ExpressionLengthException: expected 6 fields (minute, hour, dayOfMonth, month, dayOfWeek, command); received ${length}.`;
  }
}

export class UnknownAliasException extends Error {
  constructor(fieldName: string, value: string) {
    super();
    this.message = `UnknownAliasException: '${value}' is an invalid alias for field ${fieldName}`;
  }
}

export class InvalidSequenceException extends Error {
  constructor(fieldName: string, value: string) {
    super();
    this.message = `InvalidSequenceException: '${value}' is an invalid sequence for field ${fieldName}`;
  }
}

export class FieldConstraintException extends Error {
  constructor(fieldName: string, value: number, constraints: FieldConstraint) {
    super();
    this.message = `FieldConstraintException: expected value between ${constraints.min} and ${constraints.max} for field ${fieldName}; received ${value}.`;
  }
}

export class InvalidFieldExpressionException extends Error {
  constructor(fieldName: string, value: string) {
    super();
    this.message = `InvalidFieldExpressionException: expression '${value}' contains invalid characters for field ${fieldName}.`;
  }
}

export class RepeatFrequencyException extends Error {
  constructor(fieldName: string, size: number, frequency: number) {
    super();
    this.message = `RepeatFrequencyException: '${size}' cannot be evenly divided by ${frequency} for field ${fieldName}.`;
  }
}

export class InvalidDayOfMonthException extends Error {
  constructor(dayOfMonth: number, daysInMonth: number, month: number) {
    super();
    const [monthStr] =
      Object.entries(ALIASES['month']).find(
        ([, monthVal]: [string, number]) => month === monthVal
      ) ?? [];
    this.message = `InvalidDayOfMonthException: dayOfMonth set to ${dayOfMonth} but month is set to ${monthStr}; ${monthStr} has ${daysInMonth} days.`;
  }
}
