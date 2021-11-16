import { FIELD_NAME_MAP } from './constants';
import { MappedExpressionWithCommand } from './types';

function pad(str: string, len: number) {
  return Array.from({ length: len }, (_, idx) => {
    return str[idx] ?? ' ';
  }).join('');
}

export function table(
  mappedExpressionWithCommand: MappedExpressionWithCommand
) {
  const { command, expression } = mappedExpressionWithCommand;
  const rows = Object.entries(expression)
    .map(([name, values]) => {
      const paddedName = pad(FIELD_NAME_MAP[name], 14);
      const valueStr = values.join(' ');
      return `${paddedName}${valueStr}`;
    })
    .concat(`command       ${command}\n`);
  return rows.join('\n');
}
