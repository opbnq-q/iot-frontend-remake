import type { IConfigFieldSchema } from "./interfaces/config.field.schema.interface";
import type { IValidationConfig } from "./interfaces/validation.config.interface";

export class ValidationConfigBuilder {
  public readonly type: IConfigFieldSchema["type"];
  private readonly validationConfig: IValidationConfig = {};

  constructor(type: IConfigFieldSchema["type"]) {
    this.type = type;
  }

  setLength(options: { max?: number; min?: number }): void {
    if (this.type === "string") {
      this.validationConfig.length = options as IValidationConfig["length"];
    }
  }

  setNumberValue(options: { max?: number; min?: number }): void {
    if (this.type === "number") {
      this.validationConfig.value = {
        number: options,
      };
    }
  }

  setNotnull(value = true): void {
    this.validationConfig.notnull = value;
  }

  build(): IValidationConfig {
    if (typeof this.validationConfig.notnull === "undefined") {
      this.setNotnull(false);
    }
    return this.validationConfig;
  }
}
