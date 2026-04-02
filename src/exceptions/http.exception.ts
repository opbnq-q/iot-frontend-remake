export class HttpException extends Error {
  constructor(
    public readonly status = 500,
    cause: string = "",
  ) {
    super();
    this.message = `HTTP_ERROR: ${this.status}\nCAUSE: ${cause}`;
  }
}
