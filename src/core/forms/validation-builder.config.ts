import type { IConfigFieldSchema } from "./interfaces/config.field.schema.interface";
import type { IValidationConfig } from "./interfaces/validation.config.interface";

export class ValidationConfigBuilder {
  type: IConfigFieldSchema["type"];
  private config: IValidationConfig;

  constructor(type: IConfigFieldSchema["type"]) {
    this.type = type;
    this.config = {};
  }

  setLength(opts: { max?: number; min?: number }) {
    if (this.type == "string") {
      this.config.length = opts as IValidationConfig["length"];
    }
  }

  setNumberValue(opts: { max?: number; min?: number }) {
    if (this.type === "number") {
      this.config.value = {
        number: opts,
      };
    }
  }

  setNotnull(value = true) {
    this.config.notnull = value;
  }

  build() {
    if (typeof this.config.notnull === "undefined") this.setNotnull(false);
    return this.config;
  }
}
