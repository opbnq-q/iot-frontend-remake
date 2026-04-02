import { HttpException } from "@/exceptions/http.exception";

export interface IPingResponse {
  name: string;
  color: string;
}

export interface ITelemetryProperty {
  name: string;
  postfix: string;
  value: string;
}

export type FieldType = "int" | "float" | "string" | "bool";

export interface IParamMetadata {
  id: string;
  name: string;
  unit: string;
  type: FieldType;
  defaultValue: any;
  value: any;
}

export interface IActionArg {
  name: string;
  type: FieldType;
}

export interface IActionMetadata {
  id: string;
  name: string;
  args: IActionArg[];
}

export interface IStatusResponse {
  status: string;
}

export interface IWSHandlers {
  onMessage?: (data: ITelemetryProperty[], ws: WebSocket) => void;
  onOpen?: (event: Event, ws: WebSocket) => void;
  onError?: (event: Event, ws: WebSocket) => void;
  onClose?: (event: CloseEvent, ws: WebSocket) => void;
}

export class DeviceConnection {
  constructor(public readonly url: string) {}

  public async ping(): Promise<IPingResponse> {
    const request = await fetch(`${this.url}/ping`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!request.ok) throw new HttpException(request.status);
    return await request.json();
  }

  public async getTelemetry(): Promise<ITelemetryProperty[]> {
    const request = await fetch(`${this.url}/telemetry`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!request.ok) throw new HttpException(request.status);
    return await request.json();
  }

  public async getParamScheme(): Promise<IParamMetadata[]> {
    const request = await fetch(`${this.url}/param/scheme`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!request.ok) throw new HttpException(request.status);
    return await request.json();
  }

  public async setParam(id: string, value: any): Promise<IStatusResponse> {
    const request = await fetch(`${this.url}/param`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, value }),
    });
    if (!request.ok) throw new HttpException(request.status);
    return await request.json();
  }

  public async getActionScheme(): Promise<IActionMetadata[]> {
    const request = await fetch(`${this.url}/action/scheme`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!request.ok) throw new HttpException(request.status);
    return await request.json();
  }

  public async executeAction(
    id: string,
    args: Record<string, unknown>[],
  ): Promise<IStatusResponse> {
    const request = await fetch(`${this.url}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, args }),
    });
    if (!request.ok) throw new HttpException(request.status);
    return await request.json();
  }

  public subscribeTelemetry(handlers: IWSHandlers): WebSocket {
    const wsUrl = this.url.replace(/^http/, "ws") + "/ws";
    const ws = new WebSocket(wsUrl);

    ws.onopen = (event) => handlers.onOpen?.(event, ws);
    ws.onerror = (event) => handlers.onError?.(event, ws);
    ws.onclose = (event) => handlers.onClose?.(event, ws);
    ws.onmessage = (event) => {
      if (handlers.onMessage) {
        try {
          const data = JSON.parse(event.data) as ITelemetryProperty[];
          handlers.onMessage(data, ws);
        } catch (e) {
          console.error(e);
        }
      }
    };

    return ws;
  }
}
