const getQueryParameter = (url, parameterName) => {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get(parameterName);
};

export default getQueryParameter;
