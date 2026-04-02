export interface IValidationConfig {
  length?: {
    max: number;
    min: number;
  };
  value?: {
    number?: {
      min?: number;
      max?: number;
    };
  };
  notnull?: boolean;
}
