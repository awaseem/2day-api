export interface Return<T> {
  data: T;
  error?: Error;
}

export type ReturnPromise<T> = Promise<Return<T>>;

export function retData<T>(data: T): Return<T> {
  return {
    data,
    error: undefined,
  };
}

export function retError<T>(error: unknown): Return<T> {
  return {
    data: {} as any,
    error: error as Error,
  };
}
