import { get } from 'lodash';

export default function getInitialValue(
  name,
  cookies,
  localStorage,
  defaultValue = false
) {
  return get(localStorage, name, get(cookies, name, defaultValue));
}
