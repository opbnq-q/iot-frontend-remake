import type { IConfigFieldSchema } from "./config.field.schema.interface";

export interface IConfigSchema {
  title?: string;
  fields: Record<string, IConfigFieldSchema>;
}
