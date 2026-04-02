import type { FieldMetaType } from "../connection/device.connection";
import type { IValidationConfig } from "./interfaces/validation.config.interface";

export class ValidationConfigBuilder {
  public readonly type: FieldMetaType;
  private readonly validationConfig: IValidationConfig = {};

  constructor(type: FieldMetaType) {
    this.type = type;
  }

  setLength(options: { max?: number; min?: number }): void {
    if (this.type === "string") {
      this.validationConfig.length = options as IValidationConfig["length"];
    }
  }

  setNumberValue(options: { max?: number; min?: number }): void {
    if (this.type === "int" || this.type === "float") {
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
