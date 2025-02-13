export interface SuccessResponse<T> {
  message: string;
  statusCode: number;
  data?: T;
}
