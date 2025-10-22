"use client";

import { useState } from "react";
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
import { BookOpen, Sparkles } from "lucide-react";

// 📄 Извлечение текста из PDF
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

// 🔬 Пример анализа статьи с помощью OpenAI или Gemini API
// (тут ты можешь вставить свой ключ и реальный запрос к API)
async function analyzeScientificArticle(text: string): Promise<string> {
  // Для демонстрации мы просто имитируем анализ:
  const summary = `
# 🧠 Подробный анализ статьи

## 1. Общие сведения
Статья содержит ${Math.round(text.length / 1000)} тысяч символов текста. 
Основная тематика — создание научного инструмента или исследование в прикладной области. 
Работа включает введение, описание методологии, результаты и выводы, что соответствует структуре научной публикации.

## 2. Оценка научности
Текст демонстрирует признаки академического стиля:
- использование терминов и определений,
- наличие ссылок на источники,
- структурированность изложения.

Тем не менее, встречаются элементы описательного повествования, не всегда подкреплённые количественными данными. 
Научная строгость оценена как **7/10** — хорошая, но требует усиления обоснований и цитирования.

## 3. Методологическая часть
Методы исследования описаны корректно, однако не всегда указаны параметры экспериментов. 
Следует добавить:
- точные количественные характеристики (например, размеры выборки, пороги точности);
- диаграммы и таблицы для визуализации результатов;
- описание ограничений метода.

## 4. Структура статьи
- **Введение**: ясно обозначает тему и цель исследования.
- **Методы**: представлены общими словами, без детального анализа.
- **Результаты**: есть графики, но не всегда интерпретируются.
- **Обсуждение**: требует связи с мировой научной литературой.
- **Выводы**: краткие, но не отражают всего потенциала исследования.

## 5. Лингвистический анализ
Стиль в целом научный, однако встречаются фразы разговорного характера и повторы.
Рекомендуется:
- унифицировать термины;
- заменить неформальные конструкции;
- добавить переходные фразы между разделами.

## 6. Потенциал публикации
Работа имеет высокий потенциал для публикации в журналах уровня **Scopus Q3–Q4**, при условии:
- доработки методологии;
- уточнения формул и параметров;
- корректного форматирования ссылок по стилю APA/IEEE.

## 7. Возможные улучшения
1. Добавить ссылки на современные источники (последние 5 лет).
2. Расширить раздел с результатами.
3. Использовать визуализации — графики, диаграммы, таблицы.
4. Проверить аннотацию — она должна отражать цель, методы, результаты и выводы.
5. Указать научную новизну и практическую значимость.

## 8. Заключение
В целом, статья демонстрирует высокий уровень подготовки и соответствует академическим стандартам, 
однако нуждается в углублении методологической базы и улучшении стиля изложения. 
После правок может быть рекомендована для публикации в рецензируемом издании.

---

🧩 **Общий вывод**: работа научная, структурированная, перспективная.  
**Оценка научного уровня: 8.2 / 10**.
`;
  return summary;
}

// ---------------------- Основной компонент ----------------------

export function QuizCreator() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleAnalyzePDF = async () => {
    if (!file) {
      alert("Please select a PDF file first!");
      return;
    }

    try {
      setLoading(true);
      setAnalysis("⏳ Extracting text and analyzing, please wait...");

      const text = await extractTextFromPDF(file);
      const result = await analyzeScientificArticle(text);
      setAnalysis(result);
    } catch (err) {
      console.error("Error analyzing PDF:", err);
      setAnalysis("❌ Error during analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary rounded-full p-3 w-fit mb-2">
          <BookOpen className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="font-headline text-3xl">
          Scientific Article Analyzer
        </CardTitle>
        <CardDescription>
          Upload a scientific article in PDF format to get a detailed analysis of
          its structure, content, and scientific value.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="file">Upload a PDF</Label>
          <Input
            id="file"
            name="file"
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <Button
            type="button"
            onClick={handleAnalyzePDF}
            disabled={loading}
            className="mt-3 w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Analyzing..." : "Analyze PDF"}
          </Button>
        </div>

        {analysis && (
          <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap text-left overflow-y-auto max-h-[600px] text-sm">
            {analysis}
          </div>
        )}
      </CardContent>

      <CardFooter className="text-center text-muted-foreground">
        This tool helps assess academic writing and structure quality.
      </CardFooter>
    </Card>
  );
}