export interface EnrichResult {
  keywords: string[];
  entities: string[];
  category: string;
}

const MIN_TEXT_LENGTH = 20;
const MIN_WORD_LENGTH = 3;
const MAX_KEYWORDS = 10;
const MAX_ENTITIES = 5;

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Technology: ['apple', 'macbook', 'chip', 'computer', 'software', 'tech', 'm3', 'google', 'microsoft', 'data', 'ai', 'api', 'digital', 'internet', 'device', 'phone', 'laptop', 'battery', 'release', 'update'],
  Business: ['company', 'revenue', 'market', 'investment', 'ceo', 'profit', 'stock', 'shares', 'growth', 'customer', 'sale', 'buy', 'sell', 'deal', 'merger', 'funding', 'startup', 'business'],
  Health: ['health', 'medicine', 'doctor', 'patient', 'hospital', 'medical', 'disease', 'treatment', 'care', 'covid', 'vaccine', 'symptom', 'diagnosis', 'therapy', 'drug', 'clinical'],
};

const FALLBACK_CATEGORY = 'General';

function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= MIN_WORD_LENGTH);
}

function extractKeywords(text: string): string[] {
  const words = extractWords(text);
  const counts = new Map<string, number>();
  for (const w of words) {
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_KEYWORDS)
    .map(([w]) => w);
}

function extractEntities(text: string): string[] {
  const matches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) ?? [];
  const seen = new Set<string>();
  const entities: string[] = [];
  for (const m of matches) {
    const normalized = m.trim();
    if (normalized.length >= MIN_WORD_LENGTH && !seen.has(normalized)) {
      seen.add(normalized);
      entities.push(normalized);
      if (entities.length >= MAX_ENTITIES) break;
    }
  }
  return entities;
}

function inferCategory(text: string): string {
  const lower = text.toLowerCase();
  let bestCategory = FALLBACK_CATEGORY;
  let maxScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score++;
    }
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }
  return bestCategory;
}

export function enrichText(text: string): EnrichResult {
  return {
    keywords: extractKeywords(text),
    entities: extractEntities(text),
    category: inferCategory(text),
  };
}

export const MIN_ENRICH_TEXT_LENGTH = MIN_TEXT_LENGTH;
