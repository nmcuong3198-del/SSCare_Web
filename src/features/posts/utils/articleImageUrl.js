const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const getApiOrigin = () => {
  try {
    return new URL(API_BASE_URL, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
};

const ARTICLE_STORAGE_PREFIX = "/article/";
const PUBLIC_MEDIA_PREFIX = "/api/v1/media/article/";
const LOCAL_ONLY_HOSTS = new Set(["localhost", "127.0.0.1", "10.0.2.2"]);

const publicMediaUrl = (articlePath) => {
  const suffix = articlePath.slice(ARTICLE_STORAGE_PREFIX.length);
  return `${getApiOrigin()}${PUBLIC_MEDIA_PREFIX}${suffix}`;
};

/**
 * Backend stores article covers as /article/yyyy/MM/file.jpg. Public rendering
 * goes through /api/v1/media/article/** so the existing production /api/ reverse
 * proxy is enough and no separate Nginx /article/ rule is required.
 */
export function resolveArticleImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  const value = imageUrl.trim();
  if (!value) return null;

  if (/^(blob:|data:)/i.test(value)) return value;

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);

      // Older rows may contain http://localhost:8080/article/... . Never expose
      // that address from a deployed CMS; rebuild it against the API origin.
      const apiOrigin = new URL(getApiOrigin());
      const imageHost = url.hostname.toLowerCase();
      const pageHost = window.location.hostname.toLowerCase();
      const apiHost = apiOrigin.hostname.toLowerCase();
      if (
        url.pathname.startsWith(ARTICLE_STORAGE_PREFIX) &&
        (LOCAL_ONLY_HOSTS.has(imageHost) || imageHost === pageHost || imageHost === apiHost)
      ) {
        return publicMediaUrl(`${url.pathname}${url.search}${url.hash}`);
      }

      // Avoid mixed content for same-host legacy URLs on HTTPS production.
      if (
        window.location.protocol === "https:" &&
        url.protocol === "http:" &&
        url.hostname === window.location.hostname
      ) {
        url.protocol = "https:";
        return url.toString();
      }

      return value;
    } catch {
      return null;
    }
  }

  const path = value.startsWith("/") ? value : `/${value}`;
  if (path.startsWith(ARTICLE_STORAGE_PREFIX)) {
    return publicMediaUrl(path);
  }

  return `${getApiOrigin()}${path}`;
}
