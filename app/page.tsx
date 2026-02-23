import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Code2,
  Database,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Twitter,
  Upload,
  Wand2,
  Youtube,
} from "lucide-react";

const processCards = [
  {
    id: "1",
    title: "Upload Academic Work",
    description:
      "Upload your papers, projects, and transcripts. Our AI scans every document to build your career competency graph.",
    tag: "AUTO-SKILL EXTRACTION",
    icon: Upload,
  },
  {
    id: "2",
    title: "Get Your Roadmap",
    description:
      "Receive a custom career timeline and interactive skill tree. We visualize the exact path from your current studies.",
    tag: "PERSONALIZED EVOLUTION",
    icon: Wand2,
  },
  {
    id: "3",
    title: "Execute with Prompts",
    description:
      "Access our curated marketplace of actionable prompts. People and recruiters can verify growth from your evidence.",
    tag: "MARKETPLACE ITERATION",
    icon: Sparkles,
  },
];

const featureCards = [
  {
    title: "AI Powered",
    body: "Our model reasons deeply to accurately connect your academic writing.",
    icon: Sparkles,
  },
  {
    title: "Verified Proof",
    body: "Tamper-resistant records make skills discoverable, verifiable, and safe.",
    icon: ShieldCheck,
  },
  {
    title: "Live Updates",
    body: "Your roadmap evolves in real time as your portfolio grows.",
    icon: ArrowRight,
  },
  {
    title: "Career Ready",
    body: "Deliver meaningful career relevance, looking for specific skills.",
    icon: CheckCircle2,
  },
];

const marketCards = [
  {
    category: "DATA SCIENCE",
    title: "Python for Data Science",
    desc: "Advanced data manipulation and visualization techniques validated by AI mapping.",
    author: "Alex J.",
    price: "0.05 ETH",
    color: "bg-[#d8cff6]",
    icon: "< >",
  },
  {
    category: "BLOCKCHAIN",
    title: "Solidity Smart Contract Basics",
    desc: "Comprehensive understanding of Ethereum contracts and security patterns.",
    author: "Sarah M.",
    price: "0.08 ETH",
    color: "bg-[#c9e0f3]",
    icon: "DB",
  },
  {
    category: "DATA SCIENCE",
    title: "Python for Data Science",
    desc: "Advanced data manipulation and visualization techniques validated by AI mapping.",
    author: "Alex J.",
    price: "0.05 ETH",
    color: "bg-[#d8cff6]",
    icon: "< >",
  },
];

const testimonials = [
  {
    name: "Michael Wong",
    role: "Michael, Software Engineer",
    rating: "4.9",
    quote:
      "EduVault showed me skills I did not even know I had. Instead of guessing what to learn next, I now have a clear roadmap.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Avril Song",
    role: "Web Development Student",
    rating: "4.8",
    quote:
      "The productivity prompts 2x my research speed. It feels like having a senior mentor guiding my workflow.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Jeane Wood",
    role: "Data Science Student",
    rating: "5.0",
    quote:
      "This is LinkedIn + AI + Web3 done right. Finally, something built for career execution, not just courses.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-6 w-6 place-items-center rounded-md bg-[#7e2df8] text-white">
        <BookOpenCheck className="h-3.5 w-3.5" />
      </span>
      <span className="text-[22px] font-black tracking-tight text-[#121b32]">EduVault</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8faff] text-[#121b32]">
      <header className="border-b border-[#e8edf6] bg-white">
        <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center justify-between px-4 md:px-8">
          <Brand />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#47526f] md:flex">
            <a href="#home" className="hover:text-[#7e2df8]">
              Home
            </a>
            <a href="#marketplace" className="hover:text-[#7e2df8]">
              Marketplace
            </a>
            <a href="#verify" className="hover:text-[#7e2df8]">
              Verify
            </a>
            <a href="#contact" className="hover:text-[#7e2df8]">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-[#293450]">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-[10px] bg-[#7e2df8] px-4 py-2 text-sm font-bold text-white shadow-[0_14px_24px_-16px_rgba(126,45,248,0.95)]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="mx-auto grid w-full max-w-[1240px] gap-12 px-4 pb-20 pt-16 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[#f1e6ff] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#7e2df8]">
              Career Intelligence Platform
            </p>
            <h1 className="mt-5 text-[56px] font-black leading-[0.95] md:text-[72px]">
              Turn Academic Work
              <br />
              Into <span className="text-[#7e2df8]">Career Capital.</span>
            </h1>
            <p className="mt-5 max-w-[540px] text-base leading-relaxed text-[#5f6a88] md:text-lg">
              EduVault transforms your academic achievements into a personalized career roadmap using advanced AI skill mapping.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-[10px] bg-[#7e2df8] px-7 py-3 text-sm font-bold text-white shadow-[0_14px_24px_-16px_rgba(126,45,248,0.95)]"
              >
                Get Started
              </Link>
              <Link
                href="/marketplace"
                className="rounded-[10px] border border-[#ccd6e8] bg-white px-7 py-3 text-sm font-bold text-[#24314f]"
              >
                Explore Marketplace
              </Link>
            </div>

            <div className="mt-10 inline-flex items-center gap-3 rounded-xl border-l-2 border-[#7e2df8] bg-white px-3 py-2">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&q=80",
                  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=96&q=80",
                  "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=96&q=80",
                ].map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt="student"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
                <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-[#7e2df8] text-xs font-black text-white">
                  900+
                </span>
              </div>
              <p className="text-sm font-bold text-[#3a4562]">Join Other STEM Graduates</p>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[22px] border border-[#dfe6f3] shadow-[0_28px_50px_-36px_rgba(20,32,58,0.5)]">
              <img
                src="https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=1100&q=80"
                alt="smiling student"
                className="h-[430px] w-full object-cover md:h-[520px]"
              />
            </div>
            <article className="absolute -bottom-8 left-6 w-[260px] rounded-2xl border border-[#e4eaf4] bg-white p-4 shadow-[0_26px_40px_-30px_rgba(35,48,80,0.6)]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8a96b1]">Productivity Roadmap</p>
              <p className="mt-2 text-xs font-semibold text-[#6d7894]">Current Stage</p>
              <p className="text-sm font-black text-[#1a243f]">AI Strategy Intern</p>
              <div className="mt-2 h-1.5 rounded-full bg-[#e8edf6]">
                <div className="h-1.5 w-[72%] rounded-full bg-[#7e2df8]" />
              </div>
              <p className="mt-3 text-xs font-semibold text-[#6d7894]">Next Milestone</p>
              <p className="text-sm font-black text-[#1a243f]">Senior Data Scientist</p>
            </article>
          </div>
        </section>

        <section id="verify" className="mx-auto w-full max-w-[1240px] px-4 py-24 md:px-8">
          <div className="text-center">
            <h2 className="text-[46px] font-black leading-none md:text-[56px]">Our High-Fidelity Process</h2>
            <p className="mx-auto mt-3 max-w-[620px] text-base leading-relaxed text-[#687693] md:text-lg">
              Seamlessly transition from a student mindset to a professional identity with our AI-driven workflow.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {processCards.map((card) => (
              <article key={card.id} className="relative rounded-2xl border border-[#e3e9f3] bg-[#fbfcff] p-5">
                <span className="absolute -left-1.5 -top-1.5 grid h-8 w-8 place-items-center rounded-lg bg-[#7e2df8] text-sm font-black text-white">
                  {card.id}
                </span>
                <div className="rounded-xl border border-[#e7edf7] bg-white p-3">
                  <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1e6ff] text-[#7e2df8]">
                    <card.icon className="h-4 w-4" />
                  </div>
                  <div className="h-2 w-4/5 rounded-full bg-[#dfe7f4]" />
                  <div className="mt-2 h-2 w-3/5 rounded-full bg-[#dfe7f4]" />
                </div>
                <h3 className="mt-4 text-[32px] font-black leading-none">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#62708d]">{card.description}</p>
                <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#7e2df8]">
                  {card.tag}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[linear-gradient(135deg,#5f1ce0_0%,#8f36ff_48%,#6f2bf3_100%)] py-16 text-white">
          <div className="mx-auto w-full max-w-[1240px] px-4 md:px-8">
            <p className="text-center text-sm font-semibold text-white/75">Why choose us</p>
            <h2 className="mt-2 text-center text-[48px] font-black leading-none md:text-[60px]">
              Best Learning Experience
            </h2>
            <div className="mt-9 grid gap-3 md:grid-cols-4">
              {featureCards.map((feature) => (
                <article key={feature.title} className="rounded-xl border border-white/20 bg-white/95 p-4 text-[#16223d]">
                  <feature.icon className="h-4 w-4 text-[#7e2df8]" />
                  <h3 className="mt-2 text-[22px] font-black leading-none">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#5c6883]">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 py-20 md:px-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-[#7a86a3]">About us</p>
            <h2 className="mt-2 text-[56px] font-black leading-[0.9]">
              From <span className="text-[#7e2df8]">Coursework</span> to Career
            </h2>
            <p className="mt-4 max-w-[540px] text-lg leading-relaxed text-[#5d6a88]">
              Most students graduate without clarity. EduVault bridges the gap between school and industry by translating
              your academic history into a strategic career roadmap.
            </p>
            <Link
              href="/signup"
              className="mt-7 inline-flex rounded-[10px] bg-[#7e2df8] px-7 py-3 text-sm font-bold text-white shadow-[0_14px_24px_-16px_rgba(126,45,248,0.95)]"
            >
              Analyze My work
            </Link>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-[#dfe6f3] shadow-[0_28px_50px_-36px_rgba(20,32,58,0.5)]">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
              alt="students working with laptop"
              className="h-[360px] w-full object-cover"
            />
          </div>
        </section>

        <section id="marketplace" className="mx-auto w-full max-w-[1240px] px-4 py-14 md:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[54px] font-black leading-none">Marketplace Preview</h2>
              <p className="mt-2 text-base text-[#667492]">Discover top-tier skills minted by the community.</p>
            </div>
            <Link href="/marketplace" className="text-xs font-black uppercase tracking-wide text-[#7e2df8]">
              View Marketplace -&gt;
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {marketCards.map((card, index) => (
              <article key={`${card.title}-${index}`} className="overflow-hidden rounded-2xl border border-[#dfe6f3] bg-white">
                <div className={`grid h-[158px] place-items-center ${card.color}`}>
                  {card.icon === "DB" ? (
                    <Database className="h-9 w-9 text-[#9b70fa]" />
                  ) : (
                    <Code2 className="h-9 w-9 text-[#9b70fa]" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex gap-2">
                    <span className="rounded bg-[#f1e6ff] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#7e2df8]">
                      {card.category}
                    </span>
                    <span className="rounded bg-[#dff5e8] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-[#1da35c]">
                      Verified
                    </span>
                  </div>
                  <h3 className="mt-3 text-[32px] font-black leading-none">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#63708e]">{card.desc}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-[#edf2f8] pt-3">
                    <p className="text-xs font-semibold text-[#6f7b97]">{card.author}</p>
                    <p className="text-lg font-black text-[#7e2df8]">{card.price}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1240px] px-4 py-14 md:px-8">
          <p className="text-center text-sm text-[#7d89a4]">Testimonial</p>
          <h2 className="mt-1 text-center text-[50px] font-black leading-none">What Builders Are Saying</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-xl border border-[#e3e9f3] bg-white p-4">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="text-lg font-black leading-none">{item.name}</p>
                    <p className="text-xs text-[#71809f]">{item.role}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#f3b32f]">
                      <Star className="h-3 w-3 fill-current" /> {item.rating}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#5f6d8a]">"{item.quote}"</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[linear-gradient(110deg,#6422e7_0%,#9039ff_52%,#732cf3_100%)]">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
            <h2 className="max-w-[540px] text-[48px] font-black leading-[0.95] text-white">
              Your Academic Work Is More Valuable Than You Think.
            </h2>
            <div className="flex w-full max-w-[530px] items-center gap-2 rounded-2xl bg-white/25 p-2">
              <div className="flex h-12 flex-1 items-center gap-2 rounded-xl bg-white/20 px-3 text-white/85">
                <Mail className="h-4 w-4" />
                name@email.com
              </div>
              <button type="button" className="h-12 rounded-xl bg-[#182742] px-10 text-sm font-extrabold text-white">
                Join now
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="bg-[#131f37] text-[#cad4e8]">
        <div className="mx-auto grid w-full max-w-[1240px] gap-8 px-4 py-14 md:grid-cols-4 md:px-8">
          <div>
            <Brand />
            <p className="mt-5 max-w-[280px] text-sm leading-relaxed text-[#b9c4db]">
              AI-powered career intelligence and on-chain productivity tools for ambitious students and creators.
            </p>
          </div>

          <div>
            <p className="mb-3 text-[34px] font-black leading-none text-white">Quick links</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Our Class
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[34px] font-black leading-none text-white">Resources</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[34px] font-black leading-none text-white">Social media</p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
