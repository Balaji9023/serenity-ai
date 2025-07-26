import { JournalClient } from "@/components/journal-client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookText } from "lucide-react";

export default function JournalPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader>
          <div className="flex items-center gap-4">
            <BookText className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">Digital Journal</CardTitle>
              <CardDescription className="text-lg">A private space for your thoughts and reflections.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      <JournalClient />
    </div>
  );
}
