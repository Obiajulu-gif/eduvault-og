"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StorageFileUploaderProps {
  accept?: string;
  label?: string;
  onUploaded?: (result: { ref: string; uri: string; txHash?: string }) => void;
}

export function StorageFileUploader({
  accept = ".json,.txt,.prompt",
  label = "Click to upload or drag and drop",
  onUploaded,
}: StorageFileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError("");
    setSuccess("");
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
      setSuccess(payload.uri);
      onUploaded?.(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        className={cn(
          "flex min-h-[168px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#d7ddea] bg-[#fbfcff] px-4 text-center transition-colors hover:border-[#b8c2da]",
          uploading && "pointer-events-none opacity-70",
        )}
        onClick={() => inputRef.current?.click()}
      >
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#efe6ff] text-[#7b2ff7]">
          <UploadCloud className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-[#4f5d79]">{uploading ? "Uploading to 0G Storage..." : label}</p>
        <p className="text-xs text-[#9aa3b8]">{accept} (max 10MB)</p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />

      {success && (
        <div className="rounded-xl border border-[#d7efe3] bg-[#ecfaf2] px-3 py-2 text-xs text-[#0d9f5b]">
          Uploaded: {success}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-[#fee4e2] bg-[#fff5f4] px-3 py-2 text-xs text-[#d92d20]">
          {error}
        </div>
      )}

      <Button type="button" variant="ghost" size="sm" className="px-0" onClick={() => inputRef.current?.click()}>
        Select another file
      </Button>
    </div>
  );
}
