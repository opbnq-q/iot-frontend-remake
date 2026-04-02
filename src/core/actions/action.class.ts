import { HttpException } from "@/exceptions/http.exception";
import type {
  IActionArg,
  IActionMetadata,
} from "../connection/device.connection";

export class Action {
  id: string = "";
  name: string = "";
  args: IActionArg[] = [];

  constructor(
    private readonly conn: {
      url: string;
      getActionScheme: () => Promise<IActionMetadata>;
    },
  ) {}

  async setup() {
    const data = await this.conn.getActionScheme();
    this.update(data.id, data.name, data.args);
  }

  update(id: string, name: string, args: IActionArg[]) {
    this.id = id;
    this.name = name;
    this.args = args;
  }

  async fetch(values: { name: string; value: string }) {
    const response = await fetch(`${this.conn.url}/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.id,
        args: values,
      }),
    });

    if (!response.ok) throw new HttpException(response.status);
  }
}
