export interface SuccessResponse<T> {
  status: boolean;
  statusCode: number;
  data: T;
}
