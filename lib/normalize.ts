/**
 * Query normalization + truncation — the single owner of both steps.
 *
 * Order of operations is fixed and tested: **truncate raw input to exactly
 * MAX_QUERY_LENGTH characters first, then normalize.** Truncating first means
 * characters past the cutoff can never influence matching, even when
 * normalization later strips characters before them.
 *
 * Defense-in-depth note: the browser already enforces truncation at the input
 * layer (`maxLength`), so in the real UI this path is normally a no-op. It is
 * kept for non-DOM consumers and is exercised intentionally by unit tests.
 */

export const MAX_QUERY_LENGTH = 100;

/** Cut raw input to exactly MAX_QUERY_LENGTH characters. */
export function truncateQuery(raw: string): string {
  return raw.slice(0, MAX_QUERY_LENGTH);
}

/**
 * NFD → strip combining marks → lowercase → keep a-z0-9 only.
 * Applied identically to the query and to every haystack field so that
 * "Kita Nonton", "kita-nonton" and "KÍTA NÓNTON" all collapse to "kitanonton".
 */
export function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * A query classifies as "empty" when nothing matchable survives normalization
 * — whitespace-only, punctuation-only, or a truncated slice of either.
 */
export function isEmptyQuery(raw: string): boolean {
  return normalize(truncateQuery(raw)).length === 0;
}

/** Full pipeline used by the filter: truncate, then normalize. */
export function prepareQuery(raw: string): string {
  return normalize(truncateQuery(raw));
}
