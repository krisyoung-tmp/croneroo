export type ExpressionType =
  | 'minute'
  | 'hour'
  | 'dayOfMonth'
  | 'month'
  | 'dayOfWeek';

export interface FieldConstraint {
  min: number;
  max: number;
}

export type MappedExpression = Record<ExpressionType, number[]>;

export type MappedExpressionWithCommand = {
  expression: MappedExpression;
  command: string;
};
