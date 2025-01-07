async function fetchWithTimeout(url, options = {}) {
  const TIMEOUT_DURATION = 7000;

  try {
    // Check if we're in a browser environment where AbortSignal.timeout is available
    if (typeof window !== 'undefined' && AbortSignal.timeout) {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(TIMEOUT_DURATION),
      });
      return response;
    } else {
      // Fallback for Node.js or environments without AbortSignal.timeout
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(id);
        return response;
      } catch (error) {
        clearTimeout(id);
        throw error;
      }
    }
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new Error('Request timed out after 7 seconds');
    }
    throw error;
  }
}

export default fetchWithTimeout;