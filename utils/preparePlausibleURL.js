export default function preparePlausibleURL(params) {
  const url = new URL(location.href);
  const queryParams = new URLSearchParams(location.search);
  let customUrl =
    url.protocol + '//' + url.hostname + url.pathname.replace(/\/$/, '');
  for (const paramName of params) {
    const paramValue = queryParams.get(paramName);
    if (paramValue) customUrl = customUrl + '/' + paramValue;
  }
  return customUrl;
}
