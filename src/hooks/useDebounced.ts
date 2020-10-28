import { useRef } from 'react';
import useCreation from './useCreation';

type Fn = (...args: any[]) => any;

export interface Debounced<A extends any[], R> {
  (this: any, ...args: A): R;
  cancel(): void;
}

export function debounce<T extends Fn>(
  fn: T,
  wait: number,
  immediate: boolean,
  resultPromise: true
): Debounced<Parameters<T>, Promise<ReturnType<T>>>;
export function debounce<T extends Fn>(
  fn: T,
  wait: number,
  immediate?: boolean,
  resultCallback?: (result: ReturnType<T>) => void
): Debounced<Parameters<T>, ReturnType<T> | undefined>;
export function debounce<T extends Fn>(
  fn: T,
  wait: number,
  immediate?: boolean,
  arg?: true | ((result: ReturnType<T>) => void)
) {
  let timeout: number | null,
    result: ReturnType<T>;

  const debounced = function (this: any, ...args: Parameters<T>) {
    let context = this;

    const executor = (resolve?: (value: ReturnType<T>) => void) => {
      if (timeout) window.clearTimeout(timeout);

      if (immediate) {
        let callNow = !timeout;
        timeout = window.setTimeout(() => {
          timeout = null;
        }, wait);
        if (callNow) {
          result = fn.apply(context, args);
          if (typeof arg === 'function') arg(result);
          resolve && resolve(result);
        }
      } else {
        timeout = window.setTimeout(() => {
          result = fn.apply(context, args);
          if (typeof arg === 'function') arg(result);
          resolve && resolve(result);
        }, wait);
      }
      return result;
    };

    return arg === true ? new Promise(executor) : executor();
  };

  debounced.cancel = function () {
    window.clearTimeout(timeout!);
    timeout = null;
  };

  return debounced;
}

function useDebounced<T extends Fn>(
  fn: T,
  wait: number,
  immediate: boolean,
  resultPromise: true
): Debounced<Parameters<T>, Promise<ReturnType<T>>>;
function useDebounced<T extends Fn>(
  fn: T,
  wait: number,
  immediate?: boolean,
  resultCallback?: (result: ReturnType<T>) => void
): Debounced<Parameters<T>, ReturnType<T> | undefined>;
function useDebounced<T extends Fn>(
  fn: T,
  wait: number,
  immediate?: boolean,
  arg?: true | ((result: ReturnType<T>) => void)
) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const debounced = useCreation(() => {
    return debounce<T>(((...args) => fnRef.current(...args)) as T, wait, immediate, arg as any);
  }, []);

  return debounced;
}

export default useDebounced;
