async function fetchWithTimeout(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(7000),
    });
    return response;
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error('Request timed out after 7 seconds');
    }
    throw error;
  }
}