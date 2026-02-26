"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useIdeaStore, useAuthStore } from "@/lib/store";
import { IdeaDetail } from "@/components/ideas/IdeaDetail";
import { Spinner } from "@/components/ui";

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const userId = useAuthStore((s) => s.user.id);
  const loadIdeas = useIdeaStore((s) => s.loadIdeas);
  const idea = useIdeaStore((s) => s.ideas.find((i) => i.id === id));
  const loaded = useIdeaStore((s) => s.ideas.length > 0 || !s.loading);

  useEffect(() => {
    loadIdeas(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h2 className="text-lg font-medium text-ink mb-2">Idea not found</h2>
        <p className="text-sm text-neutral-dark mb-4">This idea may have been deleted.</p>
        <button
          onClick={() => router.push("/ideas")}
          className="text-sm text-blue-ribbon hover:underline"
        >
          Back to Ideas
        </button>
      </div>
    );
  }

  return <IdeaDetail idea={idea} />;
}
