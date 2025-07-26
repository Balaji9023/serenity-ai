"use client";

import { useState, useEffect, useMemo } from 'react';
import type { MoodLog, Mood } from '@/lib/types';
import { moodOptions } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { suggestContent } from '@/ai/flows/suggest-content';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export function DashboardClient() {
  const [moodHistory, setMoodHistory] = useState<MoodLog[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedMoods = window.localStorage.getItem('moodHistory');
      if (savedMoods) {
        setMoodHistory(JSON.parse(savedMoods));
      }
    } catch (error) {
      console.error("Failed to load mood history from local storage", error);
    }
  }, []);

  const handleMoodLog = async (mood: Mood) => {
    const newLog: MoodLog = {
      id: crypto.randomUUID(),
      mood,
      date: new Date().toISOString(),
    };
    const updatedHistory = [...moodHistory, newLog];
    setMoodHistory(updatedHistory);
    try {
      window.localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
      toast({
        title: "Mood Logged!",
        description: `You've logged your mood as "${mood}".`,
      });
    } catch (error) {
      console.error("Failed to save mood history to local storage", error);
    }

    setIsLoadingSuggestions(true);
    setIsModalOpen(true);
    try {
      const result = await suggestContent({ moodLog: mood });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      setSuggestions(["Sorry, we couldn't fetch suggestions right now."]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse();
    
    const data = last7Days.map(day => {
        const moodsOnDay = moodHistory.filter(log => new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === day);
        const moodCounts = moodsOnDay.reduce((acc, log) => {
            acc[log.mood] = (acc[log.mood] || 0) + 1;
            return acc;
        }, {} as Record<Mood, number>);
        
        return {
            date: day,
            ...moodCounts
        };
    });

    return data;
  }, [moodHistory]);

  const chartConfig = {
      Joyful: { label: "Joyful", color: "hsl(var(--chart-1))" },
      Calm: { label: "Calm", color: "hsl(var(--chart-2))" },
      Okay: { label: "Okay", color: "hsl(var(--chart-3))" },
      Anxious: { label: "Anxious", color: "hsl(var(--chart-4))" },
      Sad: { label: "Sad", color: "hsl(var(--chart-5))" },
  } satisfies ChartConfig;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Your Mood Over Time</CardTitle>
            <CardDescription>A look at your mood logs from the past 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pr-6">
            {moodHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                      <BarChart data={chartData} accessibilityLayer>
                          <CartesianGrid vertical={false} />
                          <XAxis
                              dataKey="date"
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                          />
                           <YAxis allowDecimals={false} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          {Object.keys(chartConfig).map((mood) => (
                              <Bar key={mood} dataKey={mood} fill={`var(--color-${mood})`} stackId="a" radius={4} />
                          ))}
                      </BarChart>
                  </ChartContainer>
                </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-4 rounded-lg bg-muted/50">
                  <Image src="https://placehold.co/400x200.png" alt="Placeholder chart" width={400} height={200} className="rounded-md" data-ai-hint="calm abstract" />
                  <p>Log your mood to see your trends here.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Log Your Mood</CardTitle>
            <CardDescription>Select how you're feeling right now.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 justify-center">
            {moodOptions.map(({ mood, icon: Icon }) => (
              <Button
                key={mood}
                variant="outline"
                className="w-full justify-start text-lg py-6 gap-4"
                onClick={() => handleMoodLog(mood)}
              >
                <Icon className="w-6 h-6" />
                {mood}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Personalized Suggestions</DialogTitle>
            <DialogDescription>
              Based on how you're feeling, here are a few things that might help.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoadingSuggestions ? (
              <div className="space-y-2">
                 <div className="animate-pulse bg-muted rounded-md h-8 w-full"></div>
                 <div className="animate-pulse bg-muted rounded-md h-8 w-full"></div>
                 <div className="animate-pulse bg-muted rounded-md h-8 w-2/3"></div>
              </div>
            ) : (
              <ul className="space-y-3 list-disc list-inside text-foreground">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
