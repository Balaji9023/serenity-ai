"use client";

import { useState, useEffect, useRef } from 'react';
import type { JournalEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Trash2, Edit, Save } from 'lucide-react';

export function JournalClient() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    try {
      const savedEntries = window.localStorage.getItem('journalEntries');
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries).sort((a: JournalEntry, b: JournalEntry) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (error) {
      console.error("Failed to load journal entries from local storage", error);
    }
  }, []);

  const handleSave = () => {
    if (!currentEntry.trim()) return;
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      content: currentEntry,
      date: new Date().toISOString(),
    };
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    try {
      window.localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    } catch (error) {
      console.error("Failed to save journal entries to local storage", error);
    }
    setCurrentEntry('');
  };

  const handleDelete = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    try {
      window.localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    } catch (error) {
      console.error("Failed to save journal entries to local storage", error);
    }
  };
  
  const handleEdit = (entry: JournalEntry) => {
    setEditingEntryId(entry.id);
    setEditingContent(entry.content);
  };

  const handleUpdate = (id: string) => {
    if (!editingContent.trim()) return;
    const updatedEntries = entries.map(entry => 
      entry.id === id ? { ...entry, content: editingContent } : entry
    );
    setEntries(updatedEntries);
    try {
        window.localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    } catch (error) {
        console.error("Failed to update journal entries in local storage", error);
    }
    setEditingEntryId(null);
    setEditingContent('');
  };


  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>New Entry</CardTitle>
          <CardDescription>What's on your mind today?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Start writing here..."
            className="min-h-[300px] text-base resize-none"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} className="ml-auto">Save Entry</Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Past Reflections</CardTitle>
          <CardDescription>Review your previous journal entries.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {entries.length > 0 ? (
              <div className="space-y-6">
                {entries.map((entry) => (
                  <div key={entry.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm text-muted-foreground">
                        {format(new Date(entry.date), 'MMMM d, yyyy - h:mm a')}
                      </p>
                      <div className="flex gap-2">
                        {editingEntryId === entry.id ? (
                            <Button variant="ghost" size="icon" onClick={() => handleUpdate(entry.id)}>
                                <Save className="h-4 w-4 text-primary" />
                            </Button>
                        ) : (
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    {editingEntryId === entry.id ? (
                        <Textarea 
                            value={editingContent} 
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="text-base"
                        />
                    ) : (
                        <p className="text-foreground whitespace-pre-wrap">{entry.content}</p>
                    )}
                    <Separator />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center gap-4 rounded-lg bg-muted/50 h-full">
                <p className="font-semibold">You haven't written any entries yet.</p>
                <p className="text-sm">Start a new entry to begin your journey.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
