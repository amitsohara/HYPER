export async function safeFetchJSON(url: string, options?: any, fallback: any = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      console.error(`Fetch failed for ${url} with status ${res.status}`);
      return fallback;
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(`JSON parse failed for ${url}`, text.substring(0, 50));
      return fallback;
    }
  } catch (e) {
    console.error(`Network error for ${url}`, e);
    return fallback;
  }
}
