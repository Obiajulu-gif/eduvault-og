"use client";

import { useRef, useState } from "react";
import { Upload, Sparkles, FileUp } from "lucide-react";
import { useAccount } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { shortAddress } from "@/lib/utils";
import Link from "next/link";

export default function OverviewPage() {
  const { address } = useAccount();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState("");

  const displayName = address ? shortAddress(address, 4) : "User";

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Upload failed");
      }
      setUploadedFile(payload.uri);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <h1 className="text-[40px] font-black leading-tight text-[#151f36] md:text-[46px]">Welcome to your Vault, Jane.</h1>
        <p className="text-base text-[#667391]">Your AI command center is ready for analysis.</p>
      </section>

      <Card className="border-[#e4eaf4] bg-gradient-to-r from-[#ffffff] to-[#fbf4ff]">
        <CardContent className="grid gap-5 p-5 md:p-6 lg:grid-cols-[1.45fr_1fr]">
          <div className="space-y-5">
            <p className="inline-flex rounded-full bg-[#f1e8ff] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#7b2ff7]">Get Started</p>
            <h2 className="text-[34px] font-black leading-tight text-[#1a2338] md:text-[40px]">Start your skill mapping.</h2>
            <p className="max-w-xl text-base text-[#667391]">
              Upload your academic transcripts, certificates, or projects. Our AI will analyze them to build your professional skill graph.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="h-11 px-5 text-sm md:text-base" asChild>
                <Link href="/my-skills">
                  <Upload className="mr-2 h-4 w-4" /> Upload first document
                </Link>
              </Button>
              <Button variant="secondary" className="h-11 px-5 text-sm md:text-base">
                Learn more
              </Button>
            </div>
            {uploadedFile && (
              <div className="rounded-lg border border-[#d7efe3] bg-[#ecfaf2] px-3 py-2 text-sm text-[#0d9f5b]">
                <FileUp className="mr-2 inline h-4 w-4" />
                Uploaded: {uploadedFile}
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-[#fee4e2] bg-[#fff5f4] px-3 py-2 text-sm text-[#d92d20]">
                {error}
              </div>
            )}
          </div>

          <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-[#d7ddea] bg-[#fafcff]">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#efe6ff] text-[#7b2ff7]">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-[#65708b]">Drag and drop your PDF or Docx files here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {["Skill Overview", "Personalized Roadmap"].map((title) => (
          <Card key={title} className="border-[#e4eaf4]">
            <CardContent className="space-y-4 p-5 md:p-6">
              <h3 className="text-2xl font-black text-[#1a2338] md:text-3xl">{title}</h3>
              <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-[#e7edf6] bg-[#fbfdff] text-sm font-semibold text-[#8a95ad] md:text-base">
                Upload academic work to map your skills.
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}