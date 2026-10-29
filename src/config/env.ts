// Environment configuration. The only file that reads import.meta.env.
// All values are PUBLIC (embedded in the built site). Never put secrets here.
// See .env.example for the variables.

const read = (key: string): string => String((import.meta.env as Record<string, unknown>)[key] ?? '').trim();

/** Returns the value only if it is an absolute http(s) URL; otherwise the fallback. */
const asUrl = (value: string, fallback: string): string => {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href.replace(/\/$/, '') : fallback;
  } catch {
    return fallback;
  }
};

const DEFAULT_SITE_URL = 'https://garv-gupta-portfolio.bytexl.live';

export const env = {
  /** Canonical origin, used for canonical links, Open Graph tags and the sitemap. */
  siteUrl: asUrl(read('PUBLIC_SITE_URL'), DEFAULT_SITE_URL),
  /** Optional form-service endpoint (for example Formspree). Empty means "use the mailto fallback". */
  formEndpoint: asUrl(read('PUBLIC_FORM_ENDPOINT'), ''),
  /** Build year and date, so the footer and "last updated" line are correct after every deploy. */
  year: new Date().getFullYear(),
  buildDate: new Date().toISOString().slice(0, 10),
} as const;
