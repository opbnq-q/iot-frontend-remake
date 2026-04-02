import type { FieldMetaType } from "@/core/connection/device.connection";
import type { IValidationConfig } from "./validation.config.interface";
import type { FieldType } from "../field.type";

export interface IConfigFieldSchema {
  id?: string;
  name: string;
  type: FieldMetaType;
  isReadonly: boolean;
  validation: IValidationConfig;
  defaultValue?: FieldType;
}
