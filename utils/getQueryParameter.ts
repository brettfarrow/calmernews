export default function getQueryParameter (
  url: string,
  parameterName: string,
): string {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get(parameterName);
};
