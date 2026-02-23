import { Upload, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OverviewPage() {
  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <h1 className="text-[64px] font-black leading-none text-[#151f36]">Welcome to your Vault, Jane.</h1>
        <p className="text-xl text-[#667391]">Your AI Command Center is ready for analysis.</p>
      </section>

      <Card className="border-[#e4eaf4] bg-gradient-to-r from-[#ffffff] to-[#fbf4ff]">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            <p className="inline-flex rounded-full bg-[#f1e8ff] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#7b2ff7]">Get Started</p>
            <h2 className="text-[54px] font-black leading-none text-[#1a2338]">Start your skill mapping.</h2>
            <p className="max-w-xl text-lg text-[#667391]">
              Upload your academic transcripts, certificates, or projects. Our AI will analyze them to build your professional skill graph.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="h-12 px-6 text-base">
                <Upload className="mr-2 h-4 w-4" /> Upload first document
              </Button>
              <Button variant="secondary" className="h-12 px-6 text-base">
                Learn more
              </Button>
            </div>
          </div>

          <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-[#d7ddea] bg-[#fafcff]">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#efe6ff] text-[#7b2ff7]">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="font-semibold text-[#65708b]">Drag and drop your PDF or Docx files here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {["Skill Overview", "Personalized Roadmap"].map((title) => (
          <Card key={title} className="border-[#e4eaf4]">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-[36px] font-black text-[#1a2338]">{title}</h3>
              <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-[#e7edf6] bg-[#fbfdff] text-base font-semibold text-[#8a95ad]">
                Upload academic work to map your skills.
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
