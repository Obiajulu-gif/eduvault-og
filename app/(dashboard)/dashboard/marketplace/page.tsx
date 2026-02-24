"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchPrompts } from "@/lib/client-api";
import { PromptCard } from "@/components/marketplace/prompt-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const categories = ["All", "Writing", "Code", "Research"];

function MarketplacePageContent() {
  const searchParams = useSearchParams();
  const forcedEmpty = searchParams.get("state") === "empty";
  const [activeCategory, setActiveCategory] = useState("All");

  const promptsQuery = useQuery({
    queryKey: ["prompts"],
    queryFn: () => fetchPrompts(),
  });

  const filtered = useMemo(() => {
    const source = promptsQuery.data ?? [];
    if (activeCategory === "All") return source;
    return source.filter((prompt) => {
      const category = prompt.metadata?.category ?? "All";
      if (activeCategory === "Code") return category === "Coding";
      return category === activeCategory;
    });
  }, [activeCategory, promptsQuery.data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black leading-tight text-[#151f36] md:text-[44px]">Marketplace</h1>
          <p className="pt-1 text-sm text-[#667391] md:text-base">Discover high-efficiency AI prompts curated for professional workflows.</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#7e89a4]">
          <span className="font-bold uppercase tracking-wide">Sort by</span>
          <button className="rounded-xl border border-[#dce3ef] bg-white px-3 py-2 font-semibold">Popularity</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
              activeCategory === category
                ? "bg-[#7b2ff7] text-white"
                : "border border-[#dce3ef] bg-white text-[#6d7892] hover:bg-[#f4f7fc]"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {promptsQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="border-[#e3e9f3]">
              <CardContent className="h-[300px] animate-pulse p-5" />
            </Card>
          ))}
        </div>
      ) : promptsQuery.error ? (
        <Card className="border-[#f8c6c3] bg-[#fff2f1]">
          <CardContent className="p-5">
            <p className="text-base font-semibold text-[#d92d20]">Failed to load marketplace listings.</p>
            <Button className="mt-3" onClick={() => promptsQuery.refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : forcedEmpty || filtered.length === 0 ? (
        <Card className="border-[#e4eaf4]">
          <CardContent className="space-y-5 p-8 text-center">
            <div className="mx-auto grid h-[210px] w-[210px] place-items-center rounded-full bg-[#f4f0ff] text-[#7b2ff7]">
              <span className="text-5xl">?</span>
            </div>
            <h2 className="text-3xl font-black leading-tight text-[#151f36] md:text-[38px]">We couldn&apos;t find that exact tool</h2>
            <p className="mx-auto max-w-xl text-sm text-[#667391] md:text-base">
              Try adjusting your search terms, exploring a different category, or let our community know what you&apos;re looking for.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button>Request this Prompt</Button>
              <Button variant="outline" onClick={() => setActiveCategory("All")}>
                View All Tools
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((prompt) => (
            <PromptCard key={prompt.promptId} prompt={prompt} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={null}>
      <MarketplacePageContent />
    </Suspense>
  );
}
