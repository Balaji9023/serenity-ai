import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mindfulnessExercises } from "@/lib/data";
import { BrainCircuit, PlayCircle, Clock } from "lucide-react";
import Image from 'next/image';

export default function MindfulnessPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <BrainCircuit className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mindfulness Library</h1>
          <p className="text-muted-foreground">A collection of guided exercises for relaxation and stress reduction.</p>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mindfulnessExercises.map((exercise) => (
          <Card key={exercise.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
             <CardHeader className="p-0">
               <Image src={`https://placehold.co/600x400.png`} width={600} height={400} alt={exercise.title} className="rounded-t-lg" data-ai-hint={exercise.imageHint} />
            </CardHeader>
            <div className="p-6 flex flex-col flex-grow">
              <CardTitle className="text-xl">{exercise.title}</CardTitle>
              <CardDescription>{exercise.category}</CardDescription>
              <CardContent className="p-0 pt-4 flex-grow">
                <p className="text-muted-foreground">{exercise.description}</p>
              </CardContent>
              <div className="pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{exercise.duration} min</span>
                  </div>
                  <Button>
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Start
                  </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
