export class HttpException extends Error {
  constructor(public readonly status = 500) {
    super();
    this.message = `HTTP_ERROR: ${this.status}`;
  }
}
