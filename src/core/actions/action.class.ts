import type {
  DeviceConnection,
  IActionArg,
} from "../connection/device.connection";
import type { IConfigSchema } from "../forms/interfaces/config.schema.interface";
import { FormsConfigBuilder } from "../forms/config-builder.forms";
import { FormsConfigField } from "../forms/field.config.schema";

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

  async fetch(actionId: string, args: { name: string; value: string }[]) {
    return await this.conn.executeAction(actionId, args);
  }

  getConfig(): IConfigSchema {
    const builder = new FormsConfigBuilder();
    this.args.forEach((arg) => {
      const field = new FormsConfigField();
      field.setName(arg.name);
      field.setType(arg.type);
      builder.addField(field.build());
    });
    return builder.build();
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
