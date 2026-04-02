import type { IConfigFieldSchema } from "./interfaces/config.field.schema.interface";
import type { IValidationConfig } from "./interfaces/validation.config.interface";
import { ValidationConfigBuilder } from "./validation-builder.config";

export class FormsConfigField {
  private config: Partial<IConfigFieldSchema> = {};

  setName(name: string) {
    this.config.name = name;
  }

  setValidation(validation: IValidationConfig) {
    this.config.validation = validation;
  }

  setType(type: IConfigFieldSchema["type"]) {
    this.config.type = type;
  }

  build(): IConfigFieldSchema {
    this.config.type = this.config.type ?? "string";
    this.config.name = this.config.name ?? `Данные типа ${this.config.type}`;
    this.config.validation =
      this.config.validation ??
      new ValidationConfigBuilder(this.config.type).build();
    this.config.isReadonly =
      typeof this.config.isReadonly === "undefined"
        ? false
        : this.config.isReadonly;

    return this.config as IConfigFieldSchema;
  }
}
