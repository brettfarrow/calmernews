import { get } from 'lodash';

export default function getInitialValue(
  name,
  cookies,
  localStorage,
  defaultValue = false
) {
  return get(cookies, name, get(localStorage, name, defaultValue));
}
