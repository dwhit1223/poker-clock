import { useEffect } from "react";

const SITE_NAME = "Poker Clock Pro";
const SITE_URL = "https://www.thepokerclockpro.com";
const DEFAULT_IMAGE = `${SITE_URL}/images/logo-horizontal.png`;

function upsertMeta(attr, key, content) {
  if (!content) return;

  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;

  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function Seo({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  robots = "index,follow,max-image-preview:large",
}) {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path === "/" ? "/" : path}`;

    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", image);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    upsertLink("canonical", canonicalUrl);
  }, [title, description, path, image, robots]);

  return null;
}
