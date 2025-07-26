import type { LucideIcon } from 'lucide-react';
import { Smile, Leaf, Meh, Orbit, Frown } from 'lucide-react';

export type Mood = 'Joyful' | 'Calm' | 'Okay' | 'Anxious' | 'Sad';

export const moodOptions: { mood: Mood; icon: LucideIcon, color: string }[] = [
    { mood: 'Joyful', icon: Smile, color: 'text-yellow-500' },
    { mood: 'Calm', icon: Leaf, color: 'text-green-500' },
    { mood: 'Okay', icon: Meh, color: 'text-blue-500' },
    { mood: 'Anxious', icon: Orbit, color: 'text-purple-500' },
    { mood: 'Sad', icon: Frown, color: 'text-gray-500' },
];


export interface MoodLog {
  id: string;
  mood: Mood;
  date: string; // ISO string
}

export interface JournalEntry {
  id: string;
  content: string;
  date: string; // ISO string
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface MindfulnessExercise {
    id: string;
    title: string;
    category: string;
    duration: number; // in minutes
    description: string;
    imageHint: string;
}
