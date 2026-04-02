import type { IConfigFieldSchema } from "./interfaces/config.field.schema.interface";
import type { IConfigSchema } from "./interfaces/config.schema.interface";

export class FormsConfigBuilder {
  private readonly schema: IConfigSchema = {
    fields: {},
  };

  addField(field: IConfigFieldSchema) {
    this.schema.fields[field.name] = field;
  }

  removeField(fieldName: string) {
    delete this.schema.fields[fieldName];
  }

  updateField(field: IConfigFieldSchema) {
    this.removeField(field.name);
    this.addField(field);
  }

  build(): IConfigSchema {
    this.schema.title = this.schema.title ?? "";
    return this.schema;
  }
}
