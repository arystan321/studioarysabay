import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse"; // npm install pdf-parse

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "File upload failed" });

    const file = files.file as formidable.File;
    const dataBuffer = fs.readFileSync(file.filepath);

    // Extract text from PDF
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    // Here you would call your AI function (genkit.ts) to generate quiz
    const numQuestions = fields.numQuestions ? Number(fields.numQuestions) : 5;

    // Example response
    return res.json({
      success: true,
      textPreview: text.slice(0, 500), // Just send preview
      numQuestions,
      quiz: [`Sample Q1 from ${file.originalFilename}`], // replace with AI-generated quiz
    });
  });
}
