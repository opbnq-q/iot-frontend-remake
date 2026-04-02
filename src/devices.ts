import { Device } from "./core/device/device.class";
import urlsList from "../urls.json";

export const devices: Device[] = urlsList.urls.map((url) => new Device(url));
