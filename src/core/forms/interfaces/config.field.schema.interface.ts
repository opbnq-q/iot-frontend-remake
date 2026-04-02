import type { FieldMetaType } from "@/core/connection/device.connection";
import type { IValidationConfig } from "./validation.config.interface";

export interface IConfigFieldSchema {
  name: string;
  type: FieldMetaType;
  isReadonly: boolean;
  validation: IValidationConfig;
}
