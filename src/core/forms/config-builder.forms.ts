import type { IConfigFieldSchema } from "./interfaces/config.field.schema.interface";
import type { IConfigSchema } from "./interfaces/config.schema.interface";

export class FormsConfigBuilder {
  private readonly config: IConfigSchema = {
    fields: {},
  };

  addField(field: IConfigFieldSchema): void {
    const key = field.id ?? field.name;
    this.config.fields[key] = field;
  }

  removeField(fieldName: string): void {
    delete this.config.fields[fieldName];
  }

  updateField(field: IConfigFieldSchema): void {
    const key = field.id ?? field.name;
    this.removeField(key);
    this.addField(field);
  }

  build(): IConfigSchema {
    return {
      ...this.config,
      title: this.config.title ?? "",
    };
  }
}
