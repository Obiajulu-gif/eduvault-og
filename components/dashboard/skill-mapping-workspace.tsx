"use client";

import { useMemo, useRef, useState } from "react";
import { Bot, Brain, Loader2, Send, UploadCloud } from "lucide-react";
import type { SkillMappingResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
}

function normalizeText(raw: string) {
  return raw.replace(/\s+/g, " ").trim();
}

function formatAnalysis(result: SkillMappingResult) {
  const skills = result.detectedSkills
    .slice(0, 4)
    .map((skill) => `${skill.name} (${skill.level}, ${Math.round(skill.confidence * 100)}%)`)
    .join(", ");

  const strengths = result.strengths.slice(0, 2).join(" | ");
  const gaps = result.gaps.slice(0, 2).join(" | ");

  return `I analyzed your document. Top skills: ${skills || "No strong signals yet"}. Strengths: ${strengths || "N/A"}. Gaps to improve: ${gaps || "N/A"}.`;
}

function toPromptPayload(text: string, fileName: string, uri: string) {
  return `Analyze this academic/professional document and return structured skill mapping data. 
Document file: ${fileName}
Storage reference: ${uri}
Document content:
${text}`;
}

export function SkillMappingWorkspace() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUri, setUploadedUri] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SkillMappingResult | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content: "Upload your document and I will map your skills with 0G Compute.",
    },
  ]);

  const working = uploading || analyzing;

  const uploadAndAnalyze = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(15);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });
      const uploadPayload = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadPayload.error ?? "Document upload failed");
      }

      const uri = String(uploadPayload.uri ?? "");
      setUploadedUri(uri);
      setProgress(42);
      setMessages((prev) => [
        ...prev,
        {
          id: `upload-${Date.now()}`,
          role: "assistant",
          content: `Document uploaded to 0G Storage (${uri}). Starting analysis...`,
        },
      ]);

      setUploading(false);
      setAnalyzing(true);

      const extension = selectedFile.name.toLowerCase().split(".").pop() ?? "";
      const isTextLike = selectedFile.type.startsWith("text/") || ["txt", "md", "json", "csv", "prompt"].includes(extension);
      const rawText = isTextLike
        ? normalizeText(await selectedFile.text())
        : `Binary document (${selectedFile.name}, ${Math.round(selectedFile.size / 1024)}KB).`;

      const promptInput = toPromptPayload(rawText.slice(0, 6000), selectedFile.name, uri);

      const inferResponse = await fetch("/api/compute/infer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: promptInput }),
      });
      const inferPayload = await inferResponse.json();

      if (!inferResponse.ok) {
        throw new Error(inferPayload.error ?? "Skill mapping failed");
      }

      const result = inferPayload.result as SkillMappingResult;
      setAnalysis(result);
      setProgress(100);

      setMessages((prev) => [
        ...prev,
        {
          id: `analysis-${Date.now()}`,
          role: "assistant",
          content: formatAnalysis(result),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: error instanceof Error ? error.message : "Analysis failed",
        },
      ]);
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const askFollowUp = async () => {
    const prompt = chatInput.trim();
    if (!prompt) return;

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", content: prompt }]);
    setChatInput("");

    if (!analysis) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "Upload and analyze at least one document first so I can answer with context.",
        },
      ]);
      return;
    }

    try {
      const response = await fetch("/api/compute/infer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: `Use this skill mapping context: ${JSON.stringify(analysis)}. User question: ${prompt}`,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Follow-up analysis failed");
      }

      const result = payload.result as SkillMappingResult;
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: formatAnalysis(result),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: error instanceof Error ? error.message : "Follow-up analysis failed",
        },
      ]);
    }
  };

  const statusCards = useMemo(() => {
    return [
      {
        label: "Metadata Extraction",
        value: uploadedUri ? "Complete" : "Waiting",
      },
      {
        label: "Concept Relation",
        value: analysis ? "Complete" : working ? "In Progress" : "Pending",
      },
    ];
  }, [analysis, uploadedUri, working]);

  const recommendations = useMemo(() => {
    if (!analysis) return [];
    const roadmapTasks = analysis.roadmap.flatMap((entry) => entry.tasks);
    const gapActions = analysis.gaps.map((gap) => `Close gap: ${gap}`);
    return [...roadmapTasks, ...gapActions].slice(0, 6);
  }, [analysis]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.45fr_0.9fr]">
      <div className="space-y-4">
        <Card className="border-[#e4eaf4]">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="mx-auto grid h-[170px] w-[170px] place-items-center rounded-full bg-[radial-gradient(circle,_#efe3ff_0,_#efe3ff_45%,_#e2ccff_45%,_#e2ccff_64%,_#f5edff_64%,_#f5edff_100%)]">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-b from-[#8a3bff] to-[#6f29f6] text-white">
                <Brain className="h-7 w-7" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-black leading-tight text-[#161f35] md:text-[34px]">
                EduVault AI is mapping your skills
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-[#667391] md:text-base">
                Upload a document to extract strengths, skill gaps, and a practical growth roadmap.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[620px] space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.md,.json,.csv"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setSelectedFile(file);
                  if (file) {
                    setMessages((prev) => [
                      ...prev,
                      { id: `picked-${Date.now()}`, role: "user", content: `Uploaded ${file.name}` },
                    ]);
                  }
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex min-h-[132px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#d7ddea] bg-[#fbfcff] px-4 text-center transition-colors hover:border-[#b8c2da]"
              >
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#efe6ff] text-[#7b2ff7]">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-[#4f5d79]">
                  {selectedFile ? selectedFile.name : "Click to upload document"}
                </p>
                <p className="text-xs text-[#9aa3b8]">PDF, DOC, DOCX, TXT, JSON (max 10MB)</p>
              </button>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-[#7b2ff7]">
                    {analysis ? "Analysis complete" : working ? "Processing data..." : "Ready to analyze"}
                  </span>
                  <span className="text-[#384159]">{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={() => void uploadAndAnalyze()}
                  disabled={!selectedFile || working}
                >
                  {working ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {working ? "Analyzing..." : "Analyze with 0G"}
                </Button>
                {uploadedUri ? (
                  <Button variant="outline" asChild>
                    <a href={`/api/storage/download?ref=${encodeURIComponent(uploadedUri)}`}>Download Uploaded Reference</a>
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 md:grid-cols-2">
          {statusCards.map((status) => (
            <Card key={status.label} className="border-[#e4eaf4]">
              <CardContent className="space-y-1 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-[#7b89a5]">{status.label}</p>
                <p className="text-sm font-bold text-[#1f2941]">{status.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {analysis ? (
          <div className="space-y-4">
            <Card className="border-[#e4eaf4]">
              <CardContent className="space-y-3 p-5">
                <h3 className="text-xl font-black text-[#1b2540]">Detected Skills</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  {analysis.detectedSkills.map((skill) => (
                    <div key={skill.name} className="rounded-xl border border-[#e8eef7] bg-[#fbfdff] px-3 py-2">
                      <p className="text-sm font-bold text-[#24304b]">{skill.name}</p>
                      <p className="text-xs text-[#6f7c98]">
                        {skill.level} | {Math.round(skill.confidence * 100)}% confidence
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3 md:grid-cols-2">
              <Card className="border-[#e4eaf4]">
                <CardContent className="space-y-2 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-[#7b89a5]">Strengths</p>
                  {analysis.strengths.length === 0 ? (
                    <p className="text-sm text-[#6f7c98]">No strengths extracted yet.</p>
                  ) : (
                    analysis.strengths.slice(0, 4).map((entry) => (
                      <p key={entry} className="text-sm font-semibold text-[#25314c]">
                        - {entry}
                      </p>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="border-[#e4eaf4]">
                <CardContent className="space-y-2 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-[#7b89a5]">Growth Gaps</p>
                  {analysis.gaps.length === 0 ? (
                    <p className="text-sm text-[#6f7c98]">No gaps identified.</p>
                  ) : (
                    analysis.gaps.slice(0, 4).map((entry) => (
                      <p key={entry} className="text-sm font-semibold text-[#25314c]">
                        - {entry}
                      </p>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-[#e4eaf4]">
              <CardContent className="space-y-3 p-5">
                <h3 className="text-xl font-black text-[#1b2540]">Personal Roadmap</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  {analysis.roadmap.map((entry) => (
                    <div key={`week-${entry.week}`} className="rounded-xl border border-[#e8eef7] bg-[#fbfdff] p-3">
                      <p className="text-xs font-black uppercase tracking-wide text-[#7b2ff7]">Week {entry.week}</p>
                      <p className="mt-1 text-sm font-bold text-[#22304b]">{entry.focus}</p>
                      <div className="mt-2 space-y-1 text-xs text-[#62708c]">
                        {entry.tasks.map((task) => (
                          <p key={task}>- {task}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#e4eaf4]">
              <CardContent className="space-y-2 p-5">
                <h3 className="text-xl font-black text-[#1b2540]">Recommended Next Actions</h3>
                <div className="grid gap-2 md:grid-cols-2">
                  {recommendations.map((entry, index) => (
                    <div key={`${entry}-${index}`} className="rounded-xl border border-[#e8eef7] bg-[#fbfdff] px-3 py-2 text-sm font-semibold text-[#24304b]">
                      {index + 1}. {entry}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>

      <Card className="h-full border-[#e4eaf4]">
        <div className="rounded-t-xl bg-[linear-gradient(120deg,#7b2ff7_0%,#8f3fff_100%)] px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <p className="text-sm font-bold">Strategist AI</p>
          </div>
        </div>
        <CardContent className="flex h-[640px] flex-col gap-3 p-4">
          <div className="flex-1 space-y-2 overflow-y-auto pr-1">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "assistant"
                    ? "bg-[#f4f7fc] text-[#42506f]"
                    : "ml-auto bg-[#7b2ff7] text-white"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-[#edf1f8] pt-3">
            <Input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask follow-up about your analysis..."
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void askFollowUp();
                }
              }}
            />
            <Button size="icon" onClick={() => void askFollowUp()} disabled={!chatInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
