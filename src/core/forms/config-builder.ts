import type { IConfigFieldSchema } from "./interfaces/config.field.schema.interface";
import type { IConfigSchema } from "./interfaces/config.schema.interface";

export class FormsConfigBuilder {
  private readonly config: IConfigSchema = {
    fields: {},
  };

  addField(field: IConfigFieldSchema): void {
    this.config.fields[field.name] = field;
  }

  removeField(fieldName: string): void {
    delete this.config.fields[fieldName];
  }

  updateField(field: IConfigFieldSchema): void {
    this.removeField(field.name);
    this.addField(field);
  }

  build(): IConfigSchema {
    return {
      ...this.config,
      title: this.config.title ?? "",
    };
  }
}
