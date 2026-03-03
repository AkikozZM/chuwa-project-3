export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: string;
  status?: number;
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

