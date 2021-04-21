export class HttpError extends Error {
  public statusCode: number;
  public data: unknown;

  constructor(statusCode: number, message: string, data: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}
