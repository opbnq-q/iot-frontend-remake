import type { IConfigFieldSchema } from "./interfaces/config.field.schema.interface";
import type { IValidationConfig } from "./interfaces/validation.config.interface";
import { ValidationConfigBuilder } from "./validation-builder.config";

export class FormsConfigField {
  private fieldConfig: Partial<IConfigFieldSchema> = {};

  setName(name: string): void {
    this.fieldConfig.name = name;
  }

  setId(id: string): void {
    this.fieldConfig.id = id;
  }

  setValidation(validation: IValidationConfig): void {
    this.fieldConfig.validation = validation;
  }

  setType(type: IConfigFieldSchema["type"]): void {
    this.fieldConfig.type = type;
  }

  build(): IConfigFieldSchema {
    const type = this.fieldConfig.type ?? "string";
    const validation =
      this.fieldConfig.validation ?? new ValidationConfigBuilder(type).build();
    const name = this.fieldConfig.name ?? `Данные типа ${type}`;

    return {
      id: this.fieldConfig.id ?? name,
      name,
      type,
      validation,
      isReadonly: this.fieldConfig.isReadonly ?? false,
    };
  }
}
