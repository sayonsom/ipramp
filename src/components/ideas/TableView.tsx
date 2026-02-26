"use client";

import { useRouter } from "next/navigation";
import type { Idea } from "@/lib/types";

interface TableViewProps {
  ideas: Idea[];
}

const STATUS_BADGE: Record<string, string> = {
  draft: "bg-neutral-100 text-neutral-600",
  developing: "bg-blue-50 text-blue-700",
  scored: "bg-amber-50 text-amber-700",
  filed: "bg-green-50 text-green-700",
  archived: "bg-neutral-50 text-neutral-400",
};

export function TableView({ ideas }: TableViewProps) {
  const router = useRouter();

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-text-secondary">{ideas.length} ideas</p>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-neutral-off-white border-b border-border">
              <th className="text-left px-3 py-2 text-[10px] text-text-secondary uppercase tracking-wider font-normal sticky left-0 bg-neutral-off-white">
                Title
              </th>
              <th className="text-left px-3 py-2 text-[10px] text-text-secondary uppercase tracking-wider font-normal">
                Status
              </th>
              <th className="text-left px-3 py-2 text-[10px] text-text-secondary uppercase tracking-wider font-normal">
                Score
              </th>
              <th className="text-left px-3 py-2 text-[10px] text-text-secondary uppercase tracking-wider font-normal">
                Alice
              </th>
            </tr>
          </thead>
          <tbody>
            {ideas.map((idea) => (
              <tr
                key={idea.id}
                className="border-b border-border last:border-b-0 hover:bg-neutral-off-white/50 cursor-pointer"
                onClick={() => router.push(`/ideas/${idea.id}`)}
              >
                <td className="px-3 py-2.5 sticky left-0 bg-white">
                  <p className="text-sm text-ink font-medium truncate max-w-[250px]">
                    {idea.title || "Untitled"}
                  </p>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${STATUS_BADGE[idea.status] || STATUS_BADGE.draft}`}>
                    {idea.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-xs text-text-secondary">
                  {idea.score
                    ? `${idea.score.inventiveStep}/${idea.score.defensibility}/${idea.score.productFit}`
                    : "\u2014"}
                </td>
                <td className="px-3 py-2.5 text-xs text-text-secondary">
                  {idea.aliceScore ? `${idea.aliceScore.overallScore}/100` : "\u2014"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
