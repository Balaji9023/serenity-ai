import { DashboardClient } from "@/components/dashboard-client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to Serenity AI</CardTitle>
          <CardDescription className="text-lg">Your space for mindfulness and well-being. How are you feeling today?</CardDescription>
        </CardHeader>
        <CardContent>
          <Image 
            src="https://placehold.co/1200x400.png" 
            alt="A calming, abstract image representing serenity" 
            width={1200} 
            height={400}
            className="rounded-lg shadow-lg"
            data-ai-hint="serene nature"
            priority
          />
        </CardContent>
      </Card>
      <DashboardClient />
    </div>
  );
}
