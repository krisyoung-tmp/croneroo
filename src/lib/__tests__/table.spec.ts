import test from 'ava';

import { table } from '../table';

test('successful output format', (t) => {
  const result = table({
    expression: {
      minute: [0, 10, 20, 30, 40, 50],
      hour: [12],
      dayOfMonth: [28],
      month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      dayOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
    command: '/usr/bin/find',
  });
  const expected = `minute        0 10 20 30 40 50
hour          12
day of month  28
month         1 2 3 4 5 6 7 8 9 10 11 12
day of week   0 1 2 3 4 5 6
command       /usr/bin/find
`;
  t.deepEqual(result, expected);
});
