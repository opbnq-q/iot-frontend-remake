import type { ICardConfig } from "./interfaces/config.card.interface";

export class CardsConfigBuidler implements ICardConfig {
  public title = "";
  public readonly data: Record<string, unknown> = {};

  setTitle(title: string) {
    this.title = title;
  }

  addField(key: string, value: unknown) {
    this.data[key] = value;
  }

  removeField(key: string) {
    delete this.data[key];
  }

  build(): ICardConfig {
    return this;
  }
}
