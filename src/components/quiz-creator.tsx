"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { extractKeywords } from "@/ai/flows/extractKeywords";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Sparkles } from "lucide-react";

// PDF extractor
const extractTextFromPDF = async (file: File): Promise<string> => {
  const pdfjsLib = await import("pdfjs-dist/webpack");
  const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ");
  }
  return text;
};

type QuizCreatorProps = {
  action: (formData: FormData) => Promise<void>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      <Sparkles className="mr-2 h-4 w-4" />
      {pending ? "Generating..." : "Start Quiz"}
    </Button>
  );
}

export function QuizCreator({ action }: QuizCreatorProps) {
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleExtractKeywords = async () => {
    if (!file) {
      alert("Please select a PDF file first!");
      return;
    }

    try {
      const text = await extractTextFromPDF(file);
      const { keywords } = await extractKeywords({ text, numKeywords: 5 });
      console.log("✅ Extracted keywords:", keywords);

      // Update topic state with extracted keywords
      setTopic(keywords.join(", "));

      // Clear the file to prevent reprocessing
      setFile(null);
      const fileInput = document.getElementById("file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("Error extracting keywords:", err);
      alert("Failed to extract keywords from PDF.");
    }
  };

  const handleSubmit = async (formData: FormData) => {
    // Ensure FormData uses latest topic
    console.log("Submitting topic:", topic);
    formData.set("topic", topic);

    if (!topic.trim()) {
      alert("Please enter a topic or extract keywords first.");
      return;
    }

    await action(formData);
  };

  return (
    <form action={handleSubmit}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary rounded-full p-3 w-fit mb-2">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-headline text-3xl">Create a Quiz</CardTitle>
          <CardDescription>
            Enter a topic OR upload a file and extract keywords.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Topic input */}
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Roman History, React.js Hooks"
              maxLength={1000} // allow long keyword strings
            />
          </div>

          {/* Number of questions */}
          <div className="space-y-2">
            <Label htmlFor="numQuestions">Number of Questions</Label>
            <Select name="numQuestions" defaultValue="5">
              <SelectTrigger id="numQuestions">
                <SelectValue placeholder="Select number of questions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Questions</SelectItem>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File upload + Extract button */}
          <div className="space-y-2">
            <Label htmlFor="file">Upload a PDF</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button type="button" onClick={handleExtractKeywords} className="mt-2 w-full">
              Extract Keywords
            </Button>
          </div>
        </CardContent>

        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
