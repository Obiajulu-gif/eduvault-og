"use client";

import { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const libraryCards = [
  { name: "Web3 Security", progress: 86 },
  { name: "Algorithmic Research", progress: 74 },
  { name: "DeFi Engineering", progress: 62 },
  { name: "AI Model Eval", progress: 55 },
];

export default function SkillsLibraryPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-4xl font-black leading-tight text-[#151f36] md:text-[44px]">My Skills Library</h1>
          <p className="pt-1 text-sm text-[#667391] md:text-base">24 active skills | Updated 2 hours ago</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
          <Button onClick={() => setOpen(true)}>+ Upload New Skill</Button>
        </div>
      </div>

      <Card className="border-[#7b2ff7] bg-gradient-to-r from-[#6d2cf6] to-[#8a44ff] text-white">
        <CardContent className="space-y-3 p-6">
          <p className="text-xs font-black uppercase tracking-wide text-[#ddc7ff]">Insight</p>
          <h2 className="text-2xl font-black leading-tight md:text-[32px]">Your strongest growth area is Smart Contract Security.</h2>
          <p className="text-sm text-[#efe8ff]">Based on recent uploads and prompt execution outcomes.</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {libraryCards.map((item) => (
          <Card key={item.name} className="border-[#e2e8f3]">
            <CardContent className="space-y-3 p-4">
              <p className="text-xl font-black leading-tight text-[#1a2338] md:text-2xl">{item.name}</p>
              <div className="h-2 rounded-full bg-[#edf1f8]">
                <div className="h-full rounded-full bg-[#7b2ff7]" style={{ width: `${item.progress}%` }} />
              </div>
              <p className="text-sm font-semibold text-[#7b2ff7]">{item.progress}% mapped</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[760px]">
          <DialogHeader>
            <DialogTitle>Upload to your Vault</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-2xl border border-dashed border-[#cfc6ec] bg-[#faf5ff] p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#7b2ff7]">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-lg font-semibold text-[#4f5d7a]">Drag and drop academic papers, project files, or CVs.</p>
              <p className="text-sm text-[#9aa3b8]">PDF, DOCX, or TXT (Max 20MB)</p>
            </div>

            <div className="rounded-xl border border-[#e3e9f3] p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-[#25304a]">thesis_v1.pdf</p>
                  <p className="text-xs text-[#14a261]">Ready to analyze</p>
                </div>
                <button className="rounded-lg p-1 text-[#9ca7be] hover:bg-[#f5f7fc]"><X className="h-4 w-4" /></button>
              </div>
            </div>

            <Button className="h-12 w-full text-base" onClick={() => setOpen(false)}>Start AI Mapping</Button>
            <button className="w-full text-sm font-semibold text-[#8b95ad]">Cancel and clear files</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
