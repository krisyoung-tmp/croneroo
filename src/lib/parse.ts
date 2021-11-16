import { CONSTRAINTS, EXPRESSION_MAP } from './constants';
import {
  ExpressionLengthException,
  InvalidSequenceException,
  RepeatFrequencyException,
} from './errors';
import {
  ExpressionType,
  FieldConstraint,
  MappedExpression,
  MappedExpressionWithCommand,
} from './types';
import {
  clampDaysInMonth,
  normalizeAliases,
  normalizeSpecialTokens,
  range,
} from './utils';
import { validateFieldExpression, validateValue } from './validate';

function parse(expression: string): MappedExpressionWithCommand {
  const parts = `${expression}`.trim().split(' ');

  if (parts.length < 6) {
    throw new ExpressionLengthException(parts.length);
  }

  const fieldParts = parts.slice(0, 5);
  const commandParts = parts.slice(5);

  const fields: MappedExpression = fieldParts.reduce((acc, part, idx) => {
    const fieldName: ExpressionType = EXPRESSION_MAP[idx];
    const constraints = CONSTRAINTS[idx];
    acc[fieldName] = parseField(fieldName, part, constraints);
    return acc;
  }, {} as MappedExpression);

  return {
    expression: clampDaysInMonth(fields),
    command: commandParts.join(' '),
  };
}

function parseSequence(field: ExpressionType, value: string) {
  const parts = value.split(',');
  if (parts.some((part) => !part.length)) {
    throw new InvalidSequenceException(field, value);
  }
  return parts;
}

function parseRepeat(
  value: string,
  constraints: FieldConstraint
): [string, number] {
  const parts = value.split('/');
  if (parts.length === 2 && parts[0] === `${Number(parts[0])}`) {
    parts[0] = `${parts[0]}-${constraints.max}`;
  }
  if (parts.length === 1 && parts[0] === `${Number(parts[0])}`) {
    parts[0] = `${parts[0]}-${parts[0]}`;
  }
  const repeat = parseInt(parts[1], 10);
  return [parts[0], !Number.isNaN(repeat) ? repeat : 1];
}

function parseRange(
  field: ExpressionType,
  value: [string, number],
  constraints: FieldConstraint
) {
  const [rangeStr, step] = value;
  const rangeParts = rangeStr.split('-');
  const min = parseInt(rangeParts[0], 10);
  const max = parseInt(rangeParts[1] ?? constraints.max, 10);
  const arr = range(min, max);
  if (arr.length % step !== 0)
    throw new RepeatFrequencyException(field, arr.length, step);
  return arr.filter((x) => x % step === 0);
}

function parseField(
  field: ExpressionType,
  expression: string,
  constraints: FieldConstraint
) {
  const dealiasedExpression = normalizeAliases(field, expression);
  const normalizedExpression = normalizeSpecialTokens(
    dealiasedExpression,
    constraints
  );
  const validatedExpression = validateFieldExpression(
    field,
    normalizedExpression
  );
  const sequence = parseSequence(field, validatedExpression);
  const repetitions = sequence.map((value) => parseRepeat(value, constraints));
  const ranges = repetitions.flatMap((value) =>
    parseRange(field, value, constraints)
  );
  return ranges.map((value) => validateValue(field, value, constraints));
}

export { parse };
