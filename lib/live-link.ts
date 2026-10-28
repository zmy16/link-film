/**
 * Live-link resolution — server only.
 *
 * Some providers do not own a stable domain. They publish a tiny "domain info"
 * page whose only job is to announce the address that works today, and that
 * address changes every few weeks (`new39.…`, `new40.…`, …). Linking our card
 * straight at that info page costs the visitor two clicks: one to the info page,
 * one to the real site — and the second click is the one that keeps moving.
 *
 * This module reads the info page on the server and extracts the single link
 * that means "watch films". Everything else on those pages — the anime portal,
 * the Telegram channel and group, the bookmark-to-this-page link — is
 * deliberately ignored, so the card sends people to a film site and nowhere else.
 *
 * Failure is never fatal. When a page cannot be read, returns garbage, or has no
 * matching anchor, the provider keeps its fallback `url`, which is the info page
 * itself: still correct, merely one click longer.
 */

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const FETCH_TIMEOUT_MS = 6000;

/**
 * How long a resolved address is reused before it is read again. Domains change
 * on the order of weeks, so 15 minutes is far tighter than it needs to be and
 * still keeps a traffic spike from hammering a small info page.
 */
const REVALIDATE_SECONDS = 900;

type Rule = {
  /** The info page that announces the provider's current address. */
  infoPage: string;
  /** Anchor text that means "this is the destination". */
  prefer: RegExp;
  /** Anchor text or host that must never be chosen. */
  deny: RegExp;
};

/**
 * Only providers listed here are resolved. A provider with no rule keeps its
 * static `url` and is never fetched.
 */
const RULES: Record<string, Rule> = {
  ngefilm21: {
    infoPage: "https://ngefilm.store/",
    // The info page is a single-purpose stub: one anchor, labelled with the
    // bare address. Anything social is not it.
    prefer: /nonton|film|ngefilm|klik|link/i,
    deny: /telegram|t\.me|whatsapp|facebook|instagram|favicon/i,
  },
  pusatfilm: {
    infoPage: "https://pusatfilm.id/php-information",
    // "KLIK UNTUK NONTON FILM" is the film portal. The page also offers
    // "NONTON ANIME", two Telegram links and a bookmark link back to itself —
    // none of those belong on a film card.
    prefer: /nonton\s+film/i,
    deny: /anime|telegram|t\.me|channel|group|whatsapp|facebook|instagram/i,
  },
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&([a-z]+);/gi, (whole, name: string) => {
      const replacement = NAMED_ENTITIES[name.toLowerCase()];
      return replacement ?? whole;
    });
}

type Anchor = { href: string; text: string };

/** Every `<a>` on the page, with its href and its visible text. */
function readAnchors(html: string): Anchor[] {
  const anchors: Anchor[] = [];
  const anchorTag = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;

  let match: RegExpExecArray | null;
  while ((match = anchorTag.exec(html)) !== null) {
    const href = /href\s*=\s*["']([^"']*)["']/i.exec(match[1])?.[1];
    if (!href) continue;

    const text = decodeEntities(match[2].replace(/<[^>]*>/g, " "))
      .replace(/\s+/g, " ")
      .trim();

    anchors.push({ href, text });
  }

  return anchors;
}

/** Resolve an href against the page it came from; drop anything that is not http(s). */
function absoluteHttpUrl(href: string, base: string): string | null {
  try {
    const url = new URL(href, base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * The info page sometimes carries its own path onto the host it announces.
 *
 * PusatFilm21 is the case: `pusatfilm.id/php-information` announces
 * `new1.pusatfilm21info.com`, and its anchor keeps the `/php-information` path —
 * a page that only exists on the info host and answers 404 on the real site. The
 * destination is the root there.
 *
 * So: when the chosen address lives on another host but repeats the info page's
 * own path, that path is an artefact of the announcement, not a page. Drop it.
 * NgeFilm announces a bare root already, so it is untouched.
 */
function stripCarriedStubPath(url: string, base: string): string {
  let destination: URL;
  let baseUrl: URL;
  try {
    destination = new URL(url);
    baseUrl = new URL(base);
  } catch {
    return url;
  }

  // Same host: the path is real, it belongs to the info page.
  if (destination.hostname === baseUrl.hostname) return url;
  // An info page served from the root has no stub path to carry over.
  if (baseUrl.pathname === "/") return url;

  const strip = (path: string) => path.replace(/\/+$/, "") || "/";
  if (strip(destination.pathname) !== strip(baseUrl.pathname)) return url;

  return `${destination.origin}/`;
}

/**
 * Choose the destination from the info page.
 *
 * Preference order: an anchor whose text says "watch films" → an anchor on a
 * different host → any surviving anchor. Anchors matching `deny` are removed
 * up front, so a page that only offers social links yields nothing and the
 * caller falls back to the info page.
 */
function pickDestination(rule: Rule, html: string): string | null {
  const base = rule.infoPage;
  const baseHost = new URL(base).hostname;
  const baseUrl = new URL(base);

  const candidates = readAnchors(html)
    .filter((anchor) => !rule.deny.test(anchor.text) && !rule.deny.test(anchor.href))
    .map((anchor) => ({
      text: anchor.text,
      href: anchor.href,
      url: absoluteHttpUrl(anchor.href, base),
    }))
    .filter(
      (candidate): candidate is { text: string; href: string; url: string } =>
        candidate.url !== null,
    )
    // The info page linking to itself is a bookmark hint, not the destination.
    .filter((candidate) => {
      const parsed = new URL(candidate.url);
      return !(parsed.hostname === baseHost && parsed.pathname === baseUrl.pathname);
    });

  const preferred = candidates.find((candidate) =>
    rule.prefer.test(candidate.text) || rule.prefer.test(candidate.href),
  );
  if (preferred) return stripCarriedStubPath(preferred.url, base);

  const offHost = candidates.find(
    (candidate) => new URL(candidate.url).hostname !== baseHost,
  );
  if (offHost) return stripCarriedStubPath(offHost.url, base);

  const first = candidates[0]?.url;
  return first ? stripCarriedStubPath(first, base) : null;
}

async function readInfoPage(infoPage: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(infoPage, {
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) return null;
    return await response.text();
  } catch {
    // Offline build, timeout, TLS failure, provider hiccup — all recoverable by
    // falling back to the info page, so none of them is worth bubbling up.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Resolve every provider that has a rule, in parallel.
 *
 * Only ids that appear in `RULES` produce an entry, so callers can merge the
 * result over static provider data with a plain lookup.
 */
export async function resolveLiveUrls(
  providerIds: readonly string[],
): Promise<Record<string, string>> {
  const resolvable = providerIds.filter((id) => id in RULES);

  const resolved = await Promise.all(
    resolvable.map(async (id) => {
      const rule = RULES[id];
      const html = await readInfoPage(rule.infoPage);
      if (!html) return null;
      return pickDestination(rule, html);
    }),
  );

  const urls: Record<string, string> = {};
  resolvable.forEach((id, index) => {
    const url = resolved[index];
    if (url) urls[id] = url;
  });

  return urls;
}
