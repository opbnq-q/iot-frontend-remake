import type {
  DeviceConnection,
  IActionArg,
} from "../connection/device.connection";
import type { IConfigSchema } from "../forms/interfaces/config.schema.interface";
import { FormsConfigBuilder } from "../forms/config-builder.forms";
import { FormsConfigField } from "../forms/field.config.schema";

export type CallActionArg = { name: string; value: unknown };

export class Action {
  id: string = "";
  name: string = "";
  args: IActionArg[] = [];

  constructor(private readonly conn: DeviceConnection) {}

  update(id: string, name: string, args: IActionArg[]) {
    this.id = id;
    this.name = name;
    this.args = args;
  }

  async fetch(args: Record<string, unknown>) {
    return await this.conn.executeAction(this.id, args);
  }

  getConfig(): IConfigSchema {
    const builder = new FormsConfigBuilder();
    this.args.forEach((arg) => {
      const field = new FormsConfigField();
      const argId = "id" in arg ? (arg as { id?: string }).id : undefined;
      field.setId(argId ?? arg.name);
      field.setName(arg.name);
      field.setType(arg.type);
      builder.addField(field.build());
    });
    const config = builder.build();
    return {
      ...config,
      title: this.name,
    };
  }

  static async getAll(conn: DeviceConnection) {
    const actions = await conn.getActionScheme();
    const objects: Action[] = [];
    actions.forEach((actionMetadata) => {
      const action = new Action(conn);
      action.update(
        actionMetadata.id,
        actionMetadata.name,
        actionMetadata.args,
      );
      objects.push(action);
    });
    return objects;
  }
}
