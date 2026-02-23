import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const feed = [
  {
    title: "New Sale: Market Researcher Pro",
    description: "Purchased by 0x72a...f91 for 0.08 ETH",
    status: "Success",
    time: "2 mins ago",
  },
  {
    title: "New Review Received",
    description: "Amazing prompt generation speed for UI designs.",
    status: "Success",
    time: "45 mins ago",
  },
  {
    title: "Trending Status Reached",
    description: "Cyberpunk Architect is now #3 trending.",
    status: "Pending",
    time: "3 hours ago",
  },
];

export default function ActivitiesPage() {
  return (
    <div className="space-y-5">
      <h1 className="text-4xl font-black leading-tight text-[#151f36] md:text-[44px]">Activities</h1>
      <Card className="border-[#e4eaf4]">
        <CardContent className="space-y-3 p-5">
          {feed.map((item) => (
            <div key={item.title} className="rounded-xl border border-[#e4eaf4] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xl font-black leading-tight text-[#1f2941] md:text-2xl">{item.title}</p>
                <Badge variant={item.status === "Success" ? "secondary" : "warning"}>{item.status}</Badge>
              </div>
              <p className="mt-2 text-sm text-[#6a7795] md:text-base">{item.description}</p>
              <p className="mt-1 text-sm font-semibold text-[#8f99b2]">{item.time}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
