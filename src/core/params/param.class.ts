import type {
  DeviceConnection,
  FieldMetaType,
} from "../connection/device.connection";
import type { IConfigSchema } from "../forms/interfaces/config.schema.interface";
import { FormsConfigBuilder } from "../forms/config-builder.forms";
import { FormsConfigField } from "../forms/field.config.schema";

export class Param {
  id: string = "";
  name: string = "";
  unit: string = "";
  type: FieldMetaType = "string";
  defaultValue: any;
  value: any;

  constructor(private readonly conn: DeviceConnection) {}

  update(
    id: string,
    name: string,
    unit: string,
    type: FieldMetaType,
    defaultValue: any,
    value: any,
  ) {
    this.id = id;
    this.name = name;
    this.unit = unit;
    this.type = type;
    this.defaultValue = defaultValue;
    this.value = value;
  }

  async fetch(value: any) {
    return await this.conn.setParam(this.id, value);
  }

  getConfig(): IConfigSchema {
    const builder = new FormsConfigBuilder();
    const field = new FormsConfigField();
    field.setId(this.id);
    field.setName(this.name + (this.unit ? `, ${this.unit}` : ""));
    field.setType(this.type);
    field.setDefaultValue(this.value ?? this.defaultValue);
    builder.addField(field.build());
    const config = builder.build();
    return {
      ...config,
      title: `Настройка: ${this.name}`,
    };
  }

  static async getAll(conn: DeviceConnection) {
    const params = await conn.getParamScheme();
    const objects: Param[] = [];
    params.forEach((paramMetadata) => {
      const param = new Param(conn);
      param.update(
        paramMetadata.id,
        paramMetadata.name,
        paramMetadata.unit,
        paramMetadata.type,
        paramMetadata.defaultValue,
        paramMetadata.value,
      );
      objects.push(param);
    });
    return objects;
  }
}
