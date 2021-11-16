import { VALID_CHARS } from './constants';
import {
  FieldConstraintException,
  InvalidFieldExpressionException,
} from './errors';
import { ExpressionType, FieldConstraint } from './types';

function checkConstraints(
  field: ExpressionType,
  value: number,
  constraints: FieldConstraint
) {
  if (
    typeof value !== 'number' ||
    Number.isNaN(value) ||
    value < constraints.min ||
    value > constraints.max
  ) {
    throw new FieldConstraintException(field, value, constraints);
  }
}

export function validateFieldExpression(field: ExpressionType, value: string) {
  const validator = VALID_CHARS[field];
  if (!validator.test(value)) {
    throw new InvalidFieldExpressionException(field, value);
  }
  return value;
}

export function validateValue(
  field: ExpressionType,
  result: number,
  constraints: FieldConstraint
): number {
  const value = field === 'dayOfWeek' ? result % 7 : result;
  checkConstraints(field, value, constraints);
  return value;
}
