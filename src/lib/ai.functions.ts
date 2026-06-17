import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

const EmailInput = z.object({
  recipient: z.string().trim().min(1).max(200),
  subject: z.string().trim().min(1).max(200),
  purpose: z.string().trim().min(1).max(2000),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

const EmailOutput = z.object({
  subject: z.string(),
  body: z.string(),
});

function handleAiError(err: unknown): never {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("429")) {
    throw new Error("Rate limit reached. Please wait a moment and try again.");
  }
  if (message.includes("402")) {
    throw new Error("AI credits exhausted. Please add credits to continue.");
  }
  throw new Error(message || "AI request failed");
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { experimental_output } = await generateText({
        model: gateway(MODEL),
        experimental_output: Output.object({ schema: EmailOutput }),
        system:
          "You are a professional workplace communication assistant. Write clear, well-structured, error-free emails.",
        prompt: `Write a professional email.

Recipient: ${data.recipient}
Subject: ${data.subject}
Purpose: ${data.purpose}
Tone: ${data.tone}

Requirements:
- Clear introduction
- Professional body
- Appropriate closing
- Grammar and spelling accuracy
- Use the recipient's name in the greeting
- Sign off appropriately`,
      });
      return experimental_output;
    } catch (err) {
      handleAiError(err);
    }
  });

const MeetingInput = z.object({
  notes: z.string().trim().min(10).max(20000),
});

const MeetingOutput = z.object({
  summary: z.string(),
  decisions: z.array(z.string()),
  actionItems: z.array(z.string()),
  deadlines: z.array(z.string()),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { experimental_output } = await generateText({
        model: gateway(MODEL),
        experimental_output: Output.object({ schema: MeetingOutput }),
        system: "You are an expert meeting analyst. Be concise and accurate.",
        prompt: `Analyze the meeting notes below and return:
1. An executive summary (2-4 sentences)
2. Key decisions made
3. Action items (who does what)
4. Deadlines mentioned

Meeting Notes:
${data.notes}`,
      });
      return experimental_output;
    } catch (err) {
      handleAiError(err);
    }
  });
