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

export interface IUpdateMessage {
  props: ITelemetryProperty[];
  name: string;
  color: string;
}

export interface IWSHandlers {
  onMessage?: (data: IUpdateMessage, ws: WebSocket) => void;
  onOpen?: (event: Event, ws: WebSocket) => void;
  onError?: (event: Event, ws: WebSocket) => void;
  onClose?: (event: CloseEvent, ws: WebSocket) => void;
}

export class DeviceConnection {
  constructor(public readonly url: string) {}

  private async requestJson<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const headers = new Headers(init.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${this.url}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) throw new HttpException(response.status);
    return (await response.json()) as T;
  }

  public async ping(): Promise<IPingResponse> {
    return this.requestJson<IPingResponse>("/ping");
  }

  public async getTelemetry(): Promise<ITelemetryProperty[]> {
    return this.requestJson<ITelemetryProperty[]>("/telemetry");
  }

  public async getParamScheme(): Promise<IParamMetadata[]> {
    return this.requestJson<IParamMetadata[]>("/param/scheme");
  }

  public async setParam(id: string, value: any): Promise<IStatusResponse> {
    return this.requestJson<IStatusResponse>("/param", {
      method: "PUT",
      body: JSON.stringify({ id, value }),
    });
  }

  public async getActionScheme(): Promise<IActionMetadata[]> {
    return this.requestJson<IActionMetadata[]>("/action/scheme");
  }

  public async executeAction(
    id: string,
    args: Record<string, unknown>[],
  ): Promise<IStatusResponse> {
    return this.requestJson<IStatusResponse>("/action", {
      method: "POST",
      body: JSON.stringify({ id, args }),
    });
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
          const data = JSON.parse(event.data) as IUpdateMessage;
          handlers.onMessage(data, ws);
        } catch (error) {
          console.error(error);
        }
      }
    };

    return ws;
  }
}
