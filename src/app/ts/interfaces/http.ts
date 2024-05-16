// import { AlertParams } from '@/store/alert/alert.actions';

/**
 * @alert - Shows default success when true or custom params
 * @ignoredErrors - Errors which are ignored from backend
 * @headers - Request headers
 **/
export interface HttpConfig {
  alert?: boolean;
  ignoredErrors?: Array<number>;
  headers?: any;
  ignorePrefix?: boolean;
}

/**
 * Other fields are required when @saveInStore is true.
 *
 * @saveInStore - Means you want to save response in store
 * @module [required] - Store module key - usually directory name
 * @selector [required] - Where to save (store selector key you use in @Select)
 * @dispatchKey [required] - Where to dispatch (dispatch key you use in .dispatch (e.g. new 'Key'()))
 **/
export interface HttpConfigWithStore extends HttpConfig {
  saveInStore: boolean;
  module: string;
  selector: string;
  dispatchKey: string;
  cache?: never;
}

/**
 * Can not be used with @saveInStore together
 *
 * @cache - Means you want to save response, when you want to make request only once
 **/
export interface HttpConfigWithCache extends HttpConfig {
  cache: boolean;
  dispatchKey?: never;
  module?: never;
  selector?: never;
  saveInStore?: never;
}

export interface HttpConfigWithoutCaching {
  cache?: never;
  dispatchKey?: never;
  module?: never;
  selector?: never;
  saveInStore?: never;
}

export type Config = HttpConfig &
  (HttpConfigWithStore | HttpConfigWithCache | HttpConfigWithoutCaching);
