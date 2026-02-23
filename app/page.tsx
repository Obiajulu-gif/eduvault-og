import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  Circle,
  Cloud,
  Database,
  Download,
  FileSearch,
  Globe,
  GraduationCap,
  Linkedin,
  Lock,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Twitter,
  Youtube,
} from "lucide-react";

const verificationSteps = [
  {
    title: "Input Credential ID",
    description:
      "Receive a unique identifier from the candidate or find it on their official EduVault profile.",
    icon: FileSearch,
  },
  {
    title: "Blockchain Check",
    description:
      "Our engine queries the immutable ledger to ensure the certificate was issued by an authorized institution.",
    icon: Sparkles,
  },
  {
    title: "Verified Report",
    description:
      "Instantly receive a tamper-proof report detailing specific skills, project outputs, and achievement dates.",
    icon: ShieldCheck,
  },
];

const skillCards = [
  { label: "TypeScript", level: "Expert level", icon: "</>" },
  { label: "AWS Lambda", level: "Advanced", icon: "CL" },
  { label: "PostgreSQL", level: "Intermediate", icon: "DB" },
  { label: "Rust", level: "Advanced", icon: "RU" },
  { label: "OAuth 2.0", level: "Expert level", icon: "OA" },
  { label: "System Design", level: "Intermediate", icon: "SD" },
];

const marketplaceCards = [
  {
    category: "Data Science",
    title: "Python for Data Science",
    description: "Advanced data manipulation and visualization techniques validated by AI mapping.",
    author: "Alex J.",
    price: "0.05 ETH",
  },
  {
    category: "Blockchain",
    title: "Solidity Smart Contract Basics",
    description: "Comprehensive understanding of Ethereum contracts and security patterns.",
    author: "Sarah M.",
    price: "0.08 ETH",
  },
  {
    category: "Data Science",
    title: "Python for Data Science",
    description: "Advanced data manipulation and visualization techniques validated by AI mapping.",
    author: "Alex J.",
    price: "0.05 ETH",
  },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-6 w-6 place-items-center rounded-md bg-[#7c2df8] text-white">
        <BookOpenCheck className="h-3.5 w-3.5" />
      </div>
      <span className="text-[28px] font-black tracking-tight text-[#101a31]">EduVault</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#111a31]">
      <header className="sticky top-0 z-40 border-b border-[#e5eaf3] bg-[#fbfcff]/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-4 md:px-8">
          <Brand />
          <nav className="hidden items-center gap-10 text-sm font-semibold text-[#49546f] lg:flex">
            <a href="#home" className="hover:text-[#6f2df3]">Home</a>
            <a href="#marketplace" className="hover:text-[#6f2df3]">Marketplace</a>
            <a href="#verify" className="hover:text-[#6f2df3]">Verify</a>
            <a href="#contact" className="hover:text-[#6f2df3]">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-[#2b3650] hover:text-[#6f2df3]">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-[#7c2df8] px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_-18px_rgba(124,45,248,0.95)] transition hover:brightness-110"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="bg-[#f1ecf9]">
          <div className="mx-auto w-full max-w-[1280px] px-4 pb-14 pt-16 md:px-8 md:pt-20">
            <div className="mx-auto max-w-[760px] text-center">
              <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#e9dcff] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#6f2df3]">
                <Circle className="h-2.5 w-2.5 fill-current stroke-0" />
                Blockchain verified
              </p>

              <h1 className="mt-6 text-[56px] font-black leading-[0.92] text-[#0f1731] md:text-[84px]">
                Instant Credential
                <br />
                Verification
              </h1>

              <p className="mx-auto mt-7 max-w-[700px] text-xl leading-relaxed text-[#5a6786]">
                Eliminate resume fraud with EduVault&apos;s blockchain-backed verification system.
                Securely validate academic and professional achievements in seconds.
              </p>

              <div className="mt-9 rounded-2xl border border-[#d7dfeb] bg-white p-2 shadow-[0_15px_30px_-20px_rgba(34,52,92,0.45)]">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex flex-1 items-center gap-3 px-4 py-3 text-[#96a3be]">
                    <Search className="h-5 w-5" />
                    <span className="text-sm font-medium md:text-base">Enter Credential ID (e.g., EV-9823-XQ-2024)</span>
                  </div>
                  <button
                    type="button"
                    className="h-12 rounded-xl bg-[#7c2df8] px-10 text-sm font-extrabold text-white shadow-[0_14px_30px_-18px_rgba(124,45,248,0.95)] transition hover:brightness-110"
                  >
                    Verify <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#7a87a4]">
                <Lock className="h-3.5 w-3.5" />
                EduVault only displays authorized public credential data.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-[#e8edf6] bg-[#f7f9fd]">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-7 md:px-8">
            <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-[#9ba7c2]">
              Trusted compliance & security
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-10 text-xl font-black text-[#5e6983]">
              <p className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> SOC2 TYPE II</p>
              <p className="inline-flex items-center gap-2"><Globe className="h-5 w-5" /> GDPR</p>
              <p className="inline-flex items-center gap-2"><GraduationCap className="h-5 w-5" /> FERPA</p>
              <p className="inline-flex items-center gap-2"><Lock className="h-5 w-5" /> CCPA</p>
            </div>
          </div>
        </section>

        <section id="verify" className="mx-auto w-full max-w-[1280px] px-4 py-16 md:px-8 md:py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {verificationSteps.map((step, index) => (
              <article key={step.title} className="rounded-2xl border border-[#e5eaf4] bg-white p-6 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#f3ecff] text-[#7b2ff7]">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[34px] font-black leading-none">{index + 1}. {step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#5f6c8b]">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#f7f9fd] py-16 md:py-20">
          <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 md:px-8 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <h2 className="text-[56px] font-black leading-[0.9]">
                Beyond Names and Titles:
                <br />
                <span className="text-[#7b2ff7]">Actionable Verification</span>
              </h2>

              <div className="mt-8 space-y-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f1e7ff] text-[#7b2ff7]">
                    <BookOpenCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">Verifiable Productivity</h3>
                    <p className="mt-2 max-w-[520px] text-base leading-relaxed text-[#5f6c8b]">
                      Move beyond generic job titles. EduVault shows verified project completions, code contributions,
                      and portfolio pieces directly linked from issuing bodies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f1e7ff] text-[#7b2ff7]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">Immutable Skills</h3>
                    <p className="mt-2 max-w-[520px] text-base leading-relaxed text-[#5f6c8b]">
                      Skills are verified at the source and recorded on a tamper-proof ledger. Once issued, they are impossible
                      to alter, forge, or exaggerate.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#e4eaf4] bg-white p-6 shadow-[0_22px_44px_-28px_rgba(27,40,70,0.45)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#c6d1e3]" />
                  <div className="space-y-2">
                    <div className="h-3 w-32 rounded-full bg-[#c7d3e5]" />
                    <div className="h-2.5 w-44 rounded-full bg-[#dbe4f1]" />
                  </div>
                </div>
                <ShieldCheck className="h-5 w-5 text-[#4ec170]" />
              </div>

              <div className="mt-6 rounded-xl border border-[#e1d4fc] bg-[#f7f0ff] p-4">
                <div className="h-3 w-20 rounded-full bg-[#b689ff]" />
                <div className="mt-3 h-3 w-full rounded-full bg-[#ad75ff]" />
              </div>

              <div className="mt-5 space-y-4">
                <div className="h-3 w-24 rounded-full bg-[#c9d4e6]" />
                <div className="h-3 w-[72%] rounded-full bg-[#becbdd]" />
                <div className="h-3 w-24 rounded-full bg-[#c9d4e6]" />
                <div className="h-3 w-[58%] rounded-full bg-[#becbdd]" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1280px] px-4 py-16 md:px-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-[44px] font-black leading-none">Verification Results</h2>
            <button type="button" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#7b2ff7]">
              <Download className="h-3.5 w-3.5" />
              Download Verification Report
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
            <div className="space-y-4">
              <article className="rounded-2xl border border-[#dfe5f1] bg-white p-5">
                <div className="mx-auto flex h-[126px] w-[126px] items-center justify-center rounded-full border-4 border-[#cad7ff] bg-[linear-gradient(145deg,#2e3b59_0,#0f1930_100%)] text-4xl text-white">
                  A
                </div>
                <h3 className="mt-4 text-center text-[40px] font-black leading-none">Alex Rivers</h3>
                <p className="mt-2 text-center text-lg text-[#697691]">Senior Full Stack Developer</p>
                <p className="mx-auto mt-3 inline-flex rounded-full bg-[#efe4ff] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#7b2ff7]">
                  Verified by EduVault AI
                </p>

                <div className="mt-5 space-y-3 border-t border-[#edf1f7] pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7a86a3]">Vault ID</span>
                    <span className="font-extrabold text-[#1c2841]">EV-8829-QX</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7a86a3]">Wallet</span>
                    <span className="font-extrabold text-[#7b2ff7]">0x71C...49A2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7a86a3]">Last Synced</span>
                    <span className="font-extrabold text-[#1c2841]">2 hours ago</span>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-[#dfe5f1] bg-white p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#93a1bb]">Integrity Metrics</p>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between text-sm font-bold">
                    <span>AI Confidence Score</span>
                    <span className="text-[#1fae65]">98%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#e5edf5]">
                    <div className="h-2.5 w-[98%] rounded-full bg-[#1fae65]" />
                  </div>
                </div>
              </article>
            </div>

            <div className="space-y-4">
              <article className="rounded-2xl border border-[#dfe5f1] bg-white p-5">
                <div className="grid gap-4 md:grid-cols-[96px_1fr] md:items-center">
                  <div className="relative grid h-24 w-24 place-items-center rounded-full border-8 border-[#7b2ff7] text-[42px] font-black">
                    89%
                  </div>
                  <div>
                    <h3 className="text-[36px] font-black leading-none">Technical Roadmap Progress</h3>
                    <p className="mt-2 text-base text-[#63708d]">
                      Alex has completed 24 out of 27 mandatory milestones for the "Senior Cloud Architect" career path.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span className="rounded-lg bg-[#dff4e6] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#1ea85f]">Verified Path</span>
                      <span className="rounded-lg bg-[#eee6fa] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#7b2ff7]">Meta Certification</span>
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-2xl border border-[#dfe5f1] bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[34px] font-black leading-none">Verified Technical Skills</h3>
                  <p className="inline-flex items-center gap-1 text-xs font-bold text-[#9aa7c1]">
                    <Lock className="h-3 w-3" />
                    Encrypted on Hedera Hashgraph
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {skillCards.map((skill) => (
                    <div key={skill.label} className="rounded-xl border border-[#e7ecf4] bg-[#f8fafe] p-3">
                      <p className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#efe4ff] text-[10px] font-black text-[#7b2ff7]">
                        {skill.icon}
                      </p>
                      <p className="mt-2 text-[18px] font-black leading-none">{skill.label}</p>
                      <p className="mt-1 text-xs font-extrabold uppercase tracking-wide text-[#19a45d]">{skill.level}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-[#dfe5f1] bg-white p-5">
                <div className="flex items-center justify-between border-b border-[#edf1f7] pb-3 text-sm text-[#7f8ba7]">
                  <p className="font-semibold">EduVault Protocol</p>
                  <p className="inline-flex items-center gap-2 font-extrabold uppercase tracking-wide text-[#49b66e]">
                    <Check className="h-3.5 w-3.5" />
                    Network status: operational
                  </p>
                </div>
                <div className="pt-4">
                  <p className="text-base font-black text-[#1b2740]">AWS Solutions Architect Associate Credential Verified</p>
                  <p className="mt-1 text-sm text-[#8a96b1]">2023-09-05 09:15:44 · AWS-ACRED-88219</p>
                  <p className="mt-3 text-sm font-bold text-[#7b2ff7]">View 14 more verification logs...</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="marketplace" className="mx-auto w-full max-w-[1280px] px-4 py-12 md:px-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[52px] font-black leading-none">Marketplace Preview</h2>
              <p className="mt-2 text-lg text-[#61708d]">Discover top-tier skills minted by the community.</p>
            </div>
            <Link href="/marketplace" className="text-sm font-black text-[#7b2ff7]">View Marketplace -&gt;</Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {marketplaceCards.map((card, index) => (
              <article key={`${card.title}-${index}`} className="overflow-hidden rounded-2xl border border-[#dfe5f1] bg-white">
                <div className={`grid h-40 place-items-center text-[#a17bf9] ${index % 2 === 1 ? "bg-[#c5ddf0]" : "bg-[#d7cff7]"}`}>
                  {index % 2 === 1 ? <Database className="h-10 w-10" /> : <p className="text-[64px] font-black">&lt; &gt;</p>}
                </div>
                <div className="p-5">
                  <div className="mb-2 flex gap-2 text-[10px] font-black uppercase tracking-wide">
                    <span className="rounded bg-[#f0e7ff] px-2 py-1 text-[#7b2ff7]">{card.category}</span>
                    <span className="rounded bg-[#ddf6e7] px-2 py-1 text-[#1ea85f]">Verified</span>
                  </div>
                  <h3 className="text-[36px] font-black leading-none">{card.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-[#61708d]">{card.description}</p>

                  <div className="mt-5 flex items-center justify-between border-t border-[#edf1f7] pt-4">
                    <span className="text-sm font-semibold text-[#7483a0]">{card.author}</span>
                    <span className="text-xl font-black text-[#7b2ff7]">{card.price}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1280px] px-4 py-10 md:px-8">
          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#7d2bfa_0%,#9a46ff_46%,#6a28e6_100%)] px-5 py-14 text-center text-white shadow-[0_28px_60px_-36px_rgba(44,15,117,0.9)] md:px-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <h2 className="text-[56px] font-black leading-none">Ready to Secure Your Hiring?</h2>
            <p className="mx-auto mt-4 max-w-[670px] text-lg text-white/85">
              Join over 500+ global enterprises that trust EduVault for secure, instantaneous candidate verification.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" className="h-12 rounded-xl bg-white px-8 text-sm font-extrabold text-[#7b2ff7]">
                Create Enterprise Account
              </button>
              <button type="button" className="h-12 rounded-xl border border-white/30 px-8 text-sm font-extrabold text-white">
                Speak to an Expert
              </button>
            </div>
          </div>
        </section>

        <section className="mt-4 bg-[linear-gradient(110deg,#6724e7_0%,#963eff_56%,#7a2ff7_100%)]">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-8">
            <h2 className="max-w-[560px] text-[52px] font-black leading-[0.95] text-white">
              Your Academic Work Is More Valuable Than You Think.
            </h2>
            <div className="flex w-full max-w-[560px] items-center gap-2 rounded-2xl bg-white/20 p-2">
              <div className="flex h-12 flex-1 items-center rounded-xl bg-white/20 px-4 text-white/80">
                <Search className="mr-2 h-4 w-4" />
                name@email.com
              </div>
              <button type="button" className="h-12 rounded-xl bg-[#182743] px-10 text-sm font-extrabold text-white">
                Join now
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-[#131f37] text-[#ccd5ea]">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
          <div>
            <Brand />
            <p className="mt-5 max-w-[280px] text-base leading-relaxed text-[#b8c3db]">
              AI-powered career intelligence and on-chain productivity tools for ambitious students and creators.
            </p>
          </div>

          <div>
            <p className="mb-3 text-[40px] font-black leading-none text-white">Quick links</p>
            <ul className="space-y-2 text-lg">
              <li><a href="#" className="hover:text-white">About us</a></li>
              <li><a href="#" className="hover:text-white">Our Class</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[40px] font-black leading-none text-white">Resources</p>
            <ul className="space-y-2 text-lg">
              <li><a href="#" className="hover:text-white">Support</a></li>
              <li><a href="#" className="hover:text-white">Privacy policy</a></li>
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[40px] font-black leading-none text-white">Social media</p>
            <div className="flex items-center gap-4 text-[#f5f7fb]">
              <a href="#" aria-label="facebook" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <Star className="h-4 w-4" />
              </a>
              <a href="#" aria-label="twitter" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="instagram" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <Circle className="h-4 w-4" />
              </a>
              <a href="#" aria-label="linkedin" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="youtube" className="rounded-full bg-white/10 p-2 hover:bg-white/20">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
