import { get } from 'lodash';

export default function getInitialValue(
  name: string,
  cookies: object,
  localStorage: Storage | object,
  defaultValue: boolean = false
): boolean | string {
  return get(localStorage, name, get(cookies, name, defaultValue));
}
