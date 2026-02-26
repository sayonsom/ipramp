"use client";

import { useCallback } from "react";

/**
 * Hook for prior art / patent search.
 *
 * OSS version: opens Google Patents in a new tab instead of calling an API.
 */
export function usePriorArt() {
  const search = useCallback((query: string, cpcFilter?: string[]) => {
    const params = new URLSearchParams();
    if (cpcFilter && cpcFilter.length > 0) {
      params.set("q", `${query} (${cpcFilter.map((c) => `cpc=${c}`).join(" OR ")})`);
    } else {
      params.set("q", query);
    }
    window.open(`https://patents.google.com/?${params.toString()}`, "_blank");
  }, []);

  return { search };
}
