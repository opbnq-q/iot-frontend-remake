import type { IValidationConfig } from "./validation.config.interface";

export interface IConfigFieldSchema {
  name: string;
  type: "string" | "number" | "boolean" | "callback";
  isReadonly: boolean;
  validation: IValidationConfig;
}
