"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Upload, X, Loader2, FileText, GraduationCap, Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isLoading?: boolean;
}

interface UploadedFile {
  name: string;
  content: string;
}

interface ChatPanelProps {
  className?: string;
}

export function ChatPanel({ className }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI Learning Path Advisor. Upload your study materials, certificates, or describe your background, and I'll create a personalized learning path and career guide for you.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamContent]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setUploadedFile({ name: file.name, content });
      setInput((prev) => prev + `\n\n[Uploaded: ${file.name}]\n`);
    };
    reader.readAsText(file);
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");
    setIsLoading(true);
    setStreamContent("");

    try {
      const conversationMessages = [
        ...messages.filter((m) => !m.isLoading),
        userMessage,
      ].map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationMessages,
          uploadedContent: uploadedFile?.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "chunk" && data.chunk) {
                accumulated += data.chunk;
                setStreamContent(accumulated);
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMessage.id
            ? { ...m, content: accumulated, isLoading: false }
            : m
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMessage.id
            ? {
                ...m,
                content: "Sorry, I encountered an error. Please try again.",
                isLoading: false,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      setStreamContent("");
    }
  };

  const analyzeWithCompute = async () => {
    if (!uploadedFile && !input.trim()) return;
    setIsLoading(true);
    const loadingMessage: Message = {
      id: `loading-c-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Build an input for skill mapping: prefer uploaded file content, else input
      const contentToAnalyze = uploadedFile?.content ?? input.trim();
      const prompt = `Analyze this content and return structured skill mapping:\n\n${contentToAnalyze}`;

      const res = await fetch("/api/compute/infer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: prompt }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error ?? "Compute inference failed");
      }

      const result = payload.result;
      // Simple formatting of returned skill mapping
      const skills = (result?.detectedSkills ?? [])
        .slice(0, 6)
        .map((s: any) => `${s.name} (${s.level}, ${Math.round((s.confidence ?? 0) * 100)}%)`)
        .join(", ");
      const strengths = (result?.strengths ?? []).slice(0, 3).join(" | ");
      const gaps = (result?.gaps ?? []).slice(0, 3).join(" | ");
      const formatted = `Skill mapping complete. Top skills: ${skills || "None"}. Strengths: ${strengths || "N/A"}. Gaps: ${gaps || "N/A"}.`;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMessage.id
            ? { ...m, content: formatted, isLoading: false }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMessage.id
            ? { ...m, content: err instanceof Error ? err.message : "Compute failed", isLoading: false }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-[#7b2ff7] shadow-lg hover:bg-[#6a21e0]"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="h-[600px] w-[450px] shadow-2xl border-[#e4eaf4]">
          <CardHeader className="border-b border-[#e4eaf4] bg-gradient-to-r from-[#7b2ff7] to-[#9b4dff] pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <GraduationCap className="h-5 w-5" />
                AI Learning Advisor
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-white/80">
              Get personalized learning paths and career guidance
            </p>
          </CardHeader>

          <CardContent className="flex h-[calc(100%-80px)] flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                        message.role === "user"
                          ? "bg-[#7b2ff7] text-white"
                          : "bg-[#f4f7fc] text-[#1f2937]"
                      )}
                    >
                      {message.isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      )}
                    </div>
                  </div>
                ))}
                {streamContent && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl bg-[#f4f7fc] px-4 py-3 text-sm">
                      <div className="whitespace-pre-wrap">{streamContent}</div>
                      <Loader2 className="mt-2 h-3 w-3 animate-spin text-[#7b2ff7]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {uploadedFile && (
              <div className="mx-4 mb-2 flex items-center gap-2 rounded-lg bg-[#efe6ff] px-3 py-2">
                <FileText className="h-4 w-4 text-[#7b2ff7]" />
                <span className="flex-1 text-sm text-[#7b2ff7]">{uploadedFile.name}</span>
                <button
                  onClick={clearUploadedFile}
                  className="text-[#7b2ff7] hover:text-[#6a21e0]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="border-t border-[#e4eaf4] p-4">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.json,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your goals, skills, or upload materials..."
                  className="min-h-[44px] resize-none"
                  disabled={isLoading}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading}
                    className="shrink-0 bg-[#7b2ff7] hover:bg-[#6a21e0]"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    onClick={analyzeWithCompute}
                    disabled={isLoading || (!uploadedFile && !input.trim())}
                    variant="outline"
                    className="shrink-0"
                    title="Analyze with 0G Compute"
                  >
                    Analyze with 0G
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-[#8792ab]">
                <Briefcase className="h-3 w-3" />
                <span>Powered by 0G Compute Network</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
