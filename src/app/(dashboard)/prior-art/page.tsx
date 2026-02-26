"use client";

import { useState } from "react";
import { Button, EmptyState } from "@/components/ui";

export default function PriorArtPage() {
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query.trim() });
    window.open(`https://patents.google.com/?${params.toString()}`, "_blank");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-ink">Prior Art Search</h1>
      </div>

      <div className="max-w-3xl mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patents on Google Patents..."
            className="flex-1 rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-blue-ribbon/40"
          />
          <Button variant="accent" size="sm" onClick={() => handleSearch}>
            Search Google Patents
          </Button>
        </form>
        <p className="text-xs text-text-muted mt-2">
          Opens Google Patents in a new tab. Filter by CPC classes like G06F (computing), G06N (AI), or H04L (networking).
        </p>
      </div>

      <EmptyState
        icon={
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        }
        title="Search patents and prior art"
        description="Enter a query above to search Google Patents. Results will open in a new tab where you can review patents, filter by CPC class, and check publication dates."
      />
    </div>
  );
}
