import test from 'ava';

import { parse } from '../parse';

test('successful output format', (t) => {
  const result = parse('*/10 12 28 * ? ./run.sh -f foo');
  const expected = {
    expression: {
      minute: [0, 10, 20, 30, 40, 50],
      hour: [12],
      dayOfMonth: [28],
      month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      dayOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
    command: './run.sh -f foo',
  };
  t.deepEqual(result, expected);
});

test('successful minute ranges', (t) => {
  const result = parse('5-20 * * * * ./run.sh -f foo');
  const expected = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  t.deepEqual(result.expression.minute, expected);
});

test('successful minute frequencies', (t) => {
  const result = parse('5-19/5 * * * * ./run.sh -f foo');
  const expected = [5, 10, 15];
  t.deepEqual(result.expression.minute, expected);
});

test('successful minute single value', (t) => {
  const result = parse('5 * * * * ./run.sh -f foo');
  const expected = [5];
  t.deepEqual(result.expression.minute, expected);
});

test('successful hour ranges', (t) => {
  const result = parse('* 9-17 * * * ./run.sh -f foo');
  const expected = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  t.deepEqual(result.expression.hour, expected);
});

test('successful hour frequencies', (t) => {
  const result = parse('* */2 * * * ./run.sh -f foo');
  const expected = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  t.deepEqual(result.expression.hour, expected);
});

test('successful hour single value', (t) => {
  const result = parse('* 5 * * * ./run.sh -f foo');
  const expected = [5];
  t.deepEqual(result.expression.hour, expected);
});

test('successful dayOfMonth ranges', (t) => {
  const result = parse('* * 9-17 * * ./run.sh -f foo');
  const expected = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  t.deepEqual(result.expression.dayOfMonth, expected);
});

test('successful dayOfMonth single value', (t) => {
  const result = parse('* * 5 * * ./run.sh -f foo');
  const expected = [5];
  t.deepEqual(result.expression.dayOfMonth, expected);
});

test('successful month ranges', (t) => {
  const result = parse('* * * 9-12 * ./run.sh -f foo');
  const expected = [9, 10, 11, 12];
  t.deepEqual(result.expression.month, expected);
});

test('successful month list', (t) => {
  const result = parse('* * * 9,12 * ./run.sh -f foo');
  const expected = [9, 12];
  t.deepEqual(result.expression.month, expected);
});

test('successful month alias list', (t) => {
  const result = parse('* * * sep,dec * ./run.sh -f foo');
  const expected = [9, 12];
  t.deepEqual(result.expression.month, expected);
});

test('successful month single value', (t) => {
  const result = parse('* * * 5 * ./run.sh -f foo');
  const expected = [5];
  t.deepEqual(result.expression.month, expected);
});

test('successful dayOfWeek ranges', (t) => {
  const result = parse('* * * * 1-5 ./run.sh -f foo');
  const expected = [1, 2, 3, 4, 5];
  t.deepEqual(result.expression.dayOfWeek, expected);
});

test('successful dayOfWeek list', (t) => {
  const result = parse('* * * * 1,5 ./run.sh -f foo');
  const expected = [1, 5];
  t.deepEqual(result.expression.dayOfWeek, expected);
});

test('successful dayOfWeek alias list', (t) => {
  const result = parse('* * * * mon,fri ./run.sh -f foo');
  const expected = [1, 5];
  t.deepEqual(result.expression.dayOfWeek, expected);
});

test('successful dayOfWeek single value', (t) => {
  const result = parse('* * * * 5 ./run.sh -f foo');
  const expected = [5];
  t.deepEqual(result.expression.dayOfWeek, expected);
});

test('fails for invalid sequences', (t) => {
  const error = t.throws(() => parse('*/10 12,,20 28 * ? ./run.sh -f foo'));
  t.is(
    error.message,
    "InvalidSequenceException: '12,,20' is an invalid sequence for field hour"
  );
});

test('fails for invalid ranges', (t) => {
  const error = t.throws(() => parse('*/10 12-5 28 * ? ./run.sh -f foo'));
  t.is(
    error.message,
    "InvalidFieldRangeException: start value must be before end value; received '12-5'."
  );
});

test('fails for invalid frequencies', (t) => {
  const error = t.throws(() => parse('*/32 12-5 28 * ? ./run.sh -f foo'));
  t.is(
    error.message,
    "RepeatFrequencyException: '60' cannot be evenly divided by 32 for field minute."
  );
});

test('fails for invalid day of the week aliases', (t) => {
  const error = t.throws(() => parse('* 12 28 * foo ./run.sh -f foo'));
  t.is(
    error.message,
    "UnknownAliasException: 'foo' is an invalid alias for field dayOfWeek"
  );
});

test('fails for invalid day of the month aliases', (t) => {
  const error = t.throws(() => parse('* 12 28 foo * ./run.sh -f foo'));
  t.is(
    error.message,
    "UnknownAliasException: 'foo' is an invalid alias for field month"
  );
});

test('fails for invalid day of the month values', (t) => {
  const error = t.throws(() => parse('* 12 31 2 * ./run.sh -f foo'));
  t.is(
    error.message,
    'InvalidDayOfMonthException: dayOfMonth set to 31 but month is set to feb; feb has 29 days.'
  );
});

test('fails for invalid minute values', (t) => {
  const error = t.throws(() => parse('62 * * * * ./run.sh -f foo'));
  t.is(
    error.message,
    'FieldConstraintException: expected value between 0 and 59 for field minute; received 62.'
  );
});
test('fails for invalid hour values', (t) => {
  const error = t.throws(() => parse('* 25 * * * ./run.sh -f foo'));
  t.is(
    error.message,
    'FieldConstraintException: expected value between 0 and 23 for field hour; received 25.'
  );
});

test('fails for invalid month values', (t) => {
  const error = t.throws(() => parse('* * * 13 * ./run.sh -f foo'));
  t.is(
    error.message,
    'FieldConstraintException: expected value between 1 and 12 for field month; received 13.'
  );
});
