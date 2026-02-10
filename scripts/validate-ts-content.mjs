import fs from 'node:fs';
import path from 'node:path';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const DEFAULT_DIRS = ['data/kennisbank', 'data/faq'];

function normalizeOwnerSite(site) {
  if (site === 'kavelarchitect' || site === 'brikx') return site;
  return 'zwijsen';
}

function getCurrentConceptSite() {
  const site = process.env.KB_SITE_MODE || process.env.NEXT_PUBLIC_SITE_MODE || 'zwijsen';
  return normalizeOwnerSite(site);
}

function getUsageRules(concept, site) {
  const rules = concept.rules_json || {};
  return (
    rules[site] ||
    rules[site === 'zwijsen' ? 'abjz' : site] || {
      max_sentences: 2,
      may_define: false,
      h1_allowed: false,
    }
  );
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function getAllConcepts() {
  const client = getSupabaseClient();
  if (!client) return [];
  const { data, error } = await client.from('kb_concepts').select('*').order('term', { ascending: true });
  if (error || !data) return [];
  return data;
}

function parseSiteArg(argv) {
  const siteArg = argv.find((arg) => arg.startsWith('--site='));
  if (!siteArg) return getCurrentConceptSite();
  return normalizeOwnerSite(siteArg.replace('--site=', ''));
}

function parseStrictArg(argv) {
  if (argv.includes('--strict')) return true;
  return process.env.STRICT_CONCEPT_VALIDATION === '1';
}

function parseContentDirs(argv) {
  const dirs = argv.filter((arg) => !arg.startsWith('--'));
  return dirs.length > 0 ? dirs : DEFAULT_DIRS;
}

function listTsFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listTsFiles(fullPath));
      continue;
    }
    if (!entry.name.endsWith('.ts') || entry.name.endsWith('.d.ts')) continue;
    out.push(fullPath);
  }
  return out;
}

function extractQuoted(source, start, quote) {
  let idx = start;
  while (idx < source.length) {
    const ch = source[idx];
    if (ch === '\\') {
      idx += 2;
      continue;
    }
    if (ch === quote) {
      return {
        end: idx + 1,
        value: source.slice(start, idx),
      };
    }
    idx += 1;
  }
  return null;
}

function extractKeyedStrings(source, keys) {
  const fields = [];
  const re = new RegExp(`\\b(${keys.join('|')})\\s*:\\s*`, 'g');
  let match;

  while ((match = re.exec(source)) !== null) {
    let idx = re.lastIndex;
    while (idx < source.length && /\s/.test(source[idx])) idx += 1;

    const quote = source[idx];
    if (quote !== "'" && quote !== '"' && quote !== '`') continue;

    const extracted = extractQuoted(source, idx + 1, quote);
    if (!extracted) continue;

    fields.push({
      key: match[1],
      value: extracted.value,
    });
    re.lastIndex = extracted.end;
  }

  return fields;
}

function stripHtml(value) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeHrefForCompare(href) {
  try {
    const parsed = new URL(href);
    return parsed.pathname.replace(/\/+$/, '') || '/';
  } catch {
    return href.replace(/\/+$/, '') || '/';
  }
}

function getCanonicalCandidates(canonicalUrl) {
  const candidates = [canonicalUrl];
  try {
    const parsed = new URL(canonicalUrl);
    candidates.push(parsed.pathname);
  } catch {
    // Keep only original value.
  }
  return candidates.map((value) => normalizeHrefForCompare(value));
}

function extractHrefs(html) {
  const hrefs = [];
  const hrefRe = /href\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRe.exec(html)) !== null) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

function hasLinkToCanonical(html, canonicalUrl) {
  const hrefs = extractHrefs(html);
  if (hrefs.length === 0) return false;

  const canonicalCandidates = getCanonicalCandidates(canonicalUrl);
  return hrefs.some((href) => {
    const normalizedHref = normalizeHrefForCompare(href);
    return canonicalCandidates.includes(normalizedHref);
  });
}

function countSentences(value) {
  return stripHtml(value)
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

function containsTerm(value, term) {
  return stripHtml(value).toLowerCase().includes(term.toLowerCase());
}

function validateFileForConcept(concept, site, filePath, source) {
  const issues = [];
  const owner = normalizeOwnerSite(concept.owner_site);
  if (owner === site) return issues;

  const contentFields = extractKeyedStrings(source, ['content', 'answer', 'antwoord', 'a']);
  const mentionFields = contentFields.filter((field) => containsTerm(field.value, concept.term));
  if (mentionFields.length === 0) return issues;

  const hasCanonicalLink = mentionFields.some((field) =>
    hasLinkToCanonical(field.value, concept.canonical_url)
  );

  if (!hasCanonicalLink) {
    issues.push({
      file: filePath,
      concept: concept.term,
      issue: `No canonical link for non-owner concept (expected ${concept.canonical_url})`,
    });
  }

  const headingFields = extractKeyedStrings(source, ['text', 'title', 'vraag', 'question', 'q']);
  const definitionRe = new RegExp(
    `\\b(wat\\s+(is|zijn)|het\\s+begrip)\\s+${escapeRegex(concept.term)}\\b`,
    'i'
  );

  if (headingFields.some((field) => definitionRe.test(stripHtml(field.value)))) {
    issues.push({
      file: filePath,
      concept: concept.term,
      issue: 'Definition-style heading used by non-owner',
    });
  }

  const totalSentences = mentionFields.reduce((count, field) => count + countSentences(field.value), 0);
  const rules = getUsageRules(concept, site);
  if (rules.max_sentences && totalSentences > rules.max_sentences * 2) {
    issues.push({
      file: filePath,
      concept: concept.term,
      issue: `Too much explanatory text (~${totalSentences} sentences, max ~${rules.max_sentences})`,
    });
  }

  return issues;
}

function validateConceptIntegrity(concepts) {
  const integrityIssues = [];
  for (const concept of concepts) {
    if (!concept.slug) integrityIssues.push('Concept without slug');
    if (!concept.term) integrityIssues.push(`Concept "${concept.slug}" missing term`);
    if (!concept.canonical_url) integrityIssues.push(`Concept "${concept.slug}" missing canonical_url`);
    if (!concept.definition_short) integrityIssues.push(`Concept "${concept.slug}" missing definition_short`);
  }
  return integrityIssues;
}

async function main() {
  const args = process.argv.slice(2);
  const site = parseSiteArg(args);
  const dirs = parseContentDirs(args);
  const strictMode = parseStrictArg(args);

  const concepts = await getAllConcepts();
  if (concepts.length === 0) {
    const msg =
      'Concept validation skipped: no concepts loaded. Check NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY and table kb_concepts.';
    if (strictMode) {
      console.error(msg);
      process.exit(1);
    } else {
      console.warn(msg);
      process.exit(0);
    }
  }

  const integrityIssues = validateConceptIntegrity(concepts);
  if (integrityIssues.length > 0) {
    console.error('Concept integrity issues found:');
    integrityIssues.forEach((issue) => console.error(`- ${issue}`));
    process.exit(1);
  }

  const files = dirs.flatMap((dir) => listTsFiles(path.resolve(process.cwd(), dir)));
  const issues = [];

  for (const filePath of files) {
    const source = fs.readFileSync(filePath, 'utf8');
    for (const concept of concepts) {
      issues.push(...validateFileForConcept(concept, site, filePath, source));
    }
  }

  if (issues.length > 0) {
    console.error(`Concept validation failed (${issues.length} issues):`);
    for (const issue of issues) {
      console.error(`- ${issue.file} | ${issue.concept} | ${issue.issue}`);
    }
    process.exit(1);
  }

  console.log(`Concept validation passed (${files.length} files, site=${site}).`);
}

main().catch((error) => {
  console.error('Concept validation crashed:', error);
  process.exit(1);
});
