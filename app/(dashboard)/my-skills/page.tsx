"use client";

import { SkillMappingWorkspace } from "@/components/dashboard/skill-mapping-workspace";

export default function MySkillsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-black leading-tight text-[#161f35] md:text-[42px]">Skill Mapping</h1>
        <p className="pt-1 text-sm text-[#667391] md:text-base">
          Upload documents to 0G, run compute analysis, and get a personalized roadmap with actionable recommendations.
        </p>
      </div>

      <SkillMappingWorkspace />
    </div>
  );
}
