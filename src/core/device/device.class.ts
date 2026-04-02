import { DeviceConnection } from "../connection/device.connection";

export interface IDataField {
  name: string;
  postfix: string;
  value: string;
}

export type Listener = (device: Device) => void;

export class Device {
  public readonly connection: DeviceConnection;
  public color?: string;
  public name?: string;

  private wsConn?: WebSocket;

  public dataFields: IDataField[] = [];

  public listeners: Listener[] = [];

  constructor(public readonly url: string) {
    this.connection = new DeviceConnection(url);
  }

  private executeListeners() {
    this.listeners.forEach((el) => el(this));
  }

  public addListener(cb: Listener) {
    this.listeners.push(cb);
  }

  async ping() {
    const response = await this.connection.ping();
    this.executeListeners();
    this.color = response.color;
    this.name = response.name;
  }

  async setupDataFields() {
    const response = await this.connection.getTelemetry();
    this.dataFields = response;
  }

  ws() {
    this.wsConn = this.connection.subscribeTelemetry({
      onMessage: (data) => {
        this.update(data.name, data.color, data.props);
        this.executeListeners();
      },
    });
  }

  closeWs() {
    if (!this.wsConn) return;
    if (this.wsConn.CLOSED) return;
    try {
      this.wsConn.close();
    } catch (e) {
      console.error(e);
    }
  }

  update(name: string, color: string, dataFields: IDataField[]) {
    this.dataFields = dataFields;
    this.name = name;
    this.color = color;
  }
}
