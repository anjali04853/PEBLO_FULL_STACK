import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI service — turns raw note content into a summary, action items and a
 * suggested title.
 *
 * Design notes:
 *  - Uses Google Gemini when LLM_API_KEY is set.
 *  - Falls back to a deterministic local heuristic when no key is present,
 *    so the app is fully demoable / testable without credentials.
 *  - Always returns the SAME shape ({ summary, actionItems, suggestedTitle,
 *    provider }), so the rest of the app never has to special-case the AI.
 */

const API_KEY = process.env.LLM_API_KEY;
const MODEL = process.env.LLM_MODEL || 'gemini-1.5-flash';

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/** True when a real provider is configured. */
export const isAIConfigured = () => Boolean(genAI);

const PROMPT = `You are an assistant inside a notes app. Given a note's raw content,
respond with STRICT JSON only (no markdown fences, no commentary) in this exact shape:
{
  "summary": "2-4 sentence plain-language summary",
  "action_items": ["short imperative task", "..."],
  "suggested_title": "a concise 3-7 word title"
}
If there are no clear action items, return an empty array.

NOTE CONTENT:
"""
{{CONTENT}}
"""`;

/** Safely pulls a JSON object out of a model response. */
function parseModelJSON(text) {
  // Strip accidental ```json fences before parsing.
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON in AI response');
  return JSON.parse(cleaned.slice(start, end + 1));
}

/** Deterministic offline fallback — keeps the app working without a key. */
function mockGenerate(content) {
  const clean = content.replace(/\s+/g, ' ').trim();
  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.length > 0);

  const summary =
    sentences.slice(0, 2).join(' ') ||
    'This note does not contain enough text to summarise.';

  // Pull lines that look like tasks (imperative / bullet style).
  const actionItems = clean
    .split(/[\n.]/)
    .map((s) => s.trim())
    .filter((s) =>
      /^(todo|action|follow up|prepare|review|send|build|fix|schedule|email|call|create|update|finish)/i.test(
        s
      )
    )
    .slice(0, 5);

  const firstWords = clean.split(' ').slice(0, 6).join(' ');
  const suggestedTitle = firstWords
    ? firstWords.charAt(0).toUpperCase() + firstWords.slice(1)
    : 'Untitled note';

  return { summary, actionItems, suggestedTitle, provider: 'mock' };
}

/**
 * Generates AI insights for a note's content.
 * @param {string} content - raw note body
 * @returns {Promise<{summary,actionItems,suggestedTitle,provider}>}
 */
export async function generateNoteInsights(content) {
  const text = (content || '').trim();
  if (text.length < 10) {
    const e = new Error('Note is too short to generate insights');
    e.status = 400;
    throw e;
  }

  if (!genAI) return mockGenerate(text);

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(
      PROMPT.replace('{{CONTENT}}', text.slice(0, 12000))
    );
    const parsed = parseModelJSON(result.response.text());

    return {
      summary: String(parsed.summary || '').trim(),
      actionItems: Array.isArray(parsed.action_items)
        ? parsed.action_items.map((s) => String(s).trim()).filter(Boolean)
        : [],
      suggestedTitle: String(parsed.suggested_title || '').trim(),
      provider: 'gemini',
    };
  } catch (err) {
    // Never crash the request on a flaky AI call — degrade to the mock.
    console.warn('AI provider failed, using fallback:', err.message);
    return mockGenerate(text);
  }
}
