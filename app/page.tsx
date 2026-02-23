import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Database,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const processSteps = [
  {
    title: "Upload Academic Work",
    description:
      "Submit projects, transcripts, and achievements. EduVault extracts verified skills and career signals.",
    icon: BookOpenCheck,
    badge: "Auto-skill extraction",
  },
  {
    title: "Generate Career Roadmap",
    description:
      "Receive a customized timeline based on your strengths, market demand, and on-chain proof history.",
    icon: TrendingUp,
    badge: "Personalized evolution",
  },
  {
    title: "Execute with Prompts",
    description:
      "Use marketplace prompts to create higher quality outputs and continuously improve your profile.",
    icon: Sparkles,
    badge: "Marketplace iteration",
  },
];

const features = [
  { title: "AI Powered", description: "Advanced analysis mapped to real career outcomes.", icon: Sparkles },
  { title: "Verified Proof", description: "Skills and milestones anchored to verifiable records.", icon: ShieldCheck },
  { title: "Live Updates", description: "Progress and roadmap are updated as your work evolves.", icon: TrendingUp },
  { title: "Career Ready", description: "Build portfolio evidence employers can trust quickly.", icon: GraduationCap },
];

const marketplaceCards = [
  {
    category: "DATA SCIENCE",
    title: "Python for Data Science",
    description: "Advanced data workflows validated by AI skill mapping.",
    author: "Alex J.",
    price: "0.05 ETH",
  },
  {
    category: "BLOCKCHAIN",
    title: "Solidity Smart Contract Basics",
    description: "Security-focused Ethereum training for builders.",
    author: "Sarah M.",
    price: "0.08 ETH",
  },
  {
    category: "PRODUCTIVITY",
    title: "Research Workflow Optimizer",
    description: "Prompt pack for faster literature reviews and summaries.",
    author: "Jeane W.",
    price: "0.06 ETH",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#101a30]">
      <header className="sticky top-0 z-30 border-b border-[#e5eaf5] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 md:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#4f5973] md:flex">
            <a href="#home" className="hover:text-[#6e2df3]">Home</a>
            <a href="#marketplace" className="hover:text-[#6e2df3]">Marketplace</a>
            <a href="#how-it-works" className="hover:text-[#6e2df3]">Verify</a>
            <a href="#contact" className="hover:text-[#6e2df3]">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="bg-[#f3eefb]">
          <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-4 py-16 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#efe4ff] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#6d2bf3]">
                <Sparkles className="h-3.5 w-3.5" /> Career Intelligence Platform
              </p>
              <h1 className="max-w-[640px] text-[62px] font-black leading-[0.95] text-[#0f1730]">
                Turn Academic Work
                <br />
                Into <span className="text-[#6f2df3]">Career Capital.</span>
              </h1>
              <p className="max-w-[620px] text-lg text-[#5d6783]">
                EduVault transforms your coursework, projects, and certificates into a verified professional profile using
                AI + on-chain proof.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/marketplace">Explore Marketplace</Link>
                </Button>
              </div>

              <div className="rounded-2xl border border-[#e4d9fb] bg-white/80 p-4">
                <p className="text-sm font-bold text-[#4c5672]">Join Other STEM Graduates</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#dcd5f7] text-xs font-black text-[#4f3a93]">A</span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d6e1ff] text-xs font-black text-[#21426f]">S</span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#fddfd8] text-xs font-black text-[#7f3a2f]">M</span>
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#6f2df3] text-xs font-black text-white">900+</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="h-[420px] rounded-[30px] border border-[#dddff2] bg-[linear-gradient(135deg,#d9e6ff_0%,#f1e7ff_52%,#efe7ff_100%)] p-4 shadow-[0_30px_80px_-44px_rgba(26,35,64,0.55)]">
                <div className="flex h-full items-end rounded-[24px] bg-[radial-gradient(circle_at_20%_10%,#f9f7ff_0,#eff1fb_48%,#e4e8f6_100%)] p-6">
                  <div className="w-full rounded-2xl border border-[#e2e7f4] bg-white p-5 shadow-[0_14px_40px_-22px_rgba(56,71,102,0.45)]">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#7f8aa6]">Productivity Roadmap</p>
                    <div className="mt-3 space-y-3">
                      <div className="rounded-xl bg-[#f5f7fc] p-3">
                        <p className="text-xs font-semibold text-[#7b86a3]">Current Stage</p>
                        <p className="text-sm font-black text-[#1e2840]">AI Strategy Intern</p>
                        <div className="mt-2 h-2 rounded-full bg-[#e9eefa]">
                          <div className="h-2 w-[72%] rounded-full bg-[#7b2ff7]" />
                        </div>
                      </div>
                      <div className="rounded-xl bg-[#f5f7fc] p-3">
                        <p className="text-xs font-semibold text-[#7b86a3]">Next Milestone</p>
                        <p className="text-sm font-black text-[#1e2840]">Senior Data Scientist</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -left-6 top-6 hidden rounded-xl border border-[#e1d7fa] bg-white px-3 py-2 text-xs font-bold text-[#6f2df3] shadow-md lg:block">
                Blockchain verified
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto w-full max-w-[1200px] px-4 py-20 md:px-8">
          <div className="mx-auto max-w-[680px] text-center">
            <h2 className="text-[46px] font-black leading-none">Our High-Fidelity Process</h2>
            <p className="mt-3 text-lg text-[#63708e]">
              Seamlessly transition from student profile to professional identity with an AI-driven workflow.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <Card key={step.title} className="border-[#e4eaf4] bg-[#fbfcff]">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#7a2ff7] text-sm font-black text-white">{index + 1}</span>
                    <step.icon className="h-5 w-5 text-[#7a2ff7]" />
                  </div>
                  <h3 className="text-xl font-black text-[#111a31]">{step.title}</h3>
                  <p className="text-sm text-[#5d6783]">{step.description}</p>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#7a2ff7]">{step.badge}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-[linear-gradient(135deg,#5b20dd_0%,#8d35ff_46%,#6626e5_100%)] py-16 text-white">
          <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
            <p className="text-center text-sm font-bold uppercase tracking-[0.22em] text-white/70">Why choose us</p>
            <h2 className="mt-2 text-center text-[46px] font-black leading-none">Best Learning Experience</h2>
            <div className="mt-10 grid gap-3 md:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-white/15 bg-white/95 text-[#111a31]">
                  <CardContent className="space-y-2 p-4">
                    <feature.icon className="h-4 w-4 text-[#7a2ff7]" />
                    <p className="text-base font-black">{feature.title}</p>
                    <p className="text-sm text-[#55607b]">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-20 md:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-[#7d89a7]">About us</p>
            <h2 className="mt-2 text-[48px] font-black leading-none">
              From <span className="text-[#6f2df3]">Coursework</span> to Career
            </h2>
            <p className="mt-4 max-w-[560px] text-lg text-[#5e6985]">
              Most students graduate without clarity. EduVault bridges that gap by translating your academic history into
              a strategic career roadmap.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/signup">Analyze My Work</Link>
            </Button>
          </div>
          <div className="rounded-[28px] border border-[#e3e9f3] bg-[linear-gradient(140deg,#d8e8ff_0,#f6f2ff_52%,#f2eefc_100%)] p-4 shadow-[0_26px_60px_-40px_rgba(20,27,43,0.55)]">
            <div className="rounded-[22px] bg-white p-5">
              <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                <div className="rounded-2xl bg-[#f5f8ff] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#6b7794]">Verified profile</p>
                  <p className="mt-2 text-sm font-black text-[#172038]">Junior Data Analyst</p>
                  <p className="mt-1 text-xs text-[#6b7794]">Confidence score</p>
                  <p className="text-2xl font-black text-[#6f2df3]">92%</p>
                </div>
                <div className="rounded-2xl bg-[#f7f3ff] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#6b7794]">Skill anchors</p>
                  <div className="mt-2 space-y-2 text-sm font-semibold text-[#29324a]">
                    <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#6f2df3]" /> SQL mastery</p>
                    <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#6f2df3]" /> Data storytelling</p>
                    <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#6f2df3]" /> API integration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="marketplace" className="mx-auto w-full max-w-[1200px] px-4 py-12 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[44px] font-black leading-none">Marketplace Preview</h2>
              <p className="mt-2 text-lg text-[#61708e]">Discover top-tier skills minted by the community.</p>
            </div>
            <Link href="/marketplace" className="text-sm font-bold text-[#6f2df3]">View Marketplace →</Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {marketplaceCards.map((card) => (
              <Card key={card.title} className="overflow-hidden border-[#e3e9f3]">
                <div className="h-36 bg-[linear-gradient(135deg,#d8cfff_0,#cfe5ff_100%)]" />
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wide">
                    <span className="rounded bg-[#efe4ff] px-2 py-1 text-[#6f2df3]">{card.category}</span>
                    <span className="rounded bg-[#e7f8ec] px-2 py-1 text-[#0f9f61]">Verified</span>
                  </div>
                  <h3 className="text-[28px] font-black leading-none">{card.title}</h3>
                  <p className="text-sm text-[#5f6f8f]">{card.description}</p>
                  <div className="flex items-center justify-between border-t border-[#edf1f8] pt-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-[#7a86a4]"><UserRound className="h-3.5 w-3.5" /> {card.author}</span>
                    <span className="font-black text-[#6f2df3]">{card.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1200px] px-4 py-12 md:px-8">
          <h2 className="text-center text-[44px] font-black leading-none">What Builders Are Saying</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                name: "Michael Wong",
                role: "Software Engineer",
                quote: "I stopped guessing what to learn next. EduVault gave me a clear roadmap in one day.",
              },
              {
                name: "Avril Song",
                role: "Web Dev Student",
                quote: "The productivity prompts doubled my research output while proving my growth path.",
              },
              {
                name: "Jeane Wood",
                role: "Data Science Student",
                quote: "It feels like LinkedIn + AI + Web3 done right for serious students and creators.",
              },
            ].map((entry) => (
              <Card key={entry.name} className="border-[#e4eaf4]">
                <CardContent className="space-y-3 p-5">
                  <p className="text-base text-[#22304a]">"{entry.quote}"</p>
                  <div className="border-t border-[#edf1f8] pt-3">
                    <p className="font-black">{entry.name}</p>
                    <p className="text-sm text-[#7381a0]">{entry.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-8 bg-[linear-gradient(110deg,#5e21de_0%,#8f38ff_56%,#6e2df3_100%)]">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-8">
            <h2 className="max-w-[540px] text-[48px] font-black leading-none text-white">
              Your Academic Work Is More Valuable Than You Think.
            </h2>
            <div className="flex w-full max-w-[520px] items-center gap-2 rounded-2xl bg-white/25 p-2">
              <div className="flex h-12 flex-1 items-center rounded-xl bg-white/25 px-3 text-white/80">
                <Database className="mr-2 h-4 w-4" /> name@email.com
              </div>
              <Button asChild className="h-12 px-8">
                <Link href="/signup">Join now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-[#131e36] text-[#cad3e8]">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-14 md:grid-cols-4 md:px-8">
          <div className="space-y-4">
            <Logo compact />
            <p className="max-w-[280px] text-sm leading-relaxed text-[#b6c1db]">
              AI-powered career intelligence and on-chain productivity tools for ambitious students and creators.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xl font-black text-white">Quick links</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/signup" className="hover:text-white">Start free</Link></li>
              <li><Link href="/marketplace" className="hover:text-white">Marketplace</Link></li>
              <li><Link href="/verify-email" className="hover:text-white">Verify profile</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xl font-black text-white">Resources</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Support</a></li>
              <li><a href="#" className="hover:text-white">Privacy policy</a></li>
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xl font-black text-white">Social media</p>
            <div className="flex gap-3">
              {["X", "In", "YT"].map((entry) => (
                <span
                  key={entry}
                  className="grid h-9 w-9 place-items-center rounded-full border border-[#2a3656] bg-[#1b2746] text-xs font-black text-white"
                >
                  {entry}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[#233150] py-4 text-center text-xs text-[#8fa0c6]">
          EduVault Protocol © 2026
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-40">
        <Button asChild size="sm">
          <Link href="/signup">Create account <ArrowRight className="ml-2 h-3.5 w-3.5" /></Link>
        </Button>
      </div>
    </div>
  );
}
