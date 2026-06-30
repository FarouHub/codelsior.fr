#!/usr/bin/env node
/**
 * Anonymisation deterministe (passe 1) pour chat-to-blog.
 * Lit le transcript sur stdin, ecrit la version masquee sur stdout,
 * et anonymize_report.json dans le cwd.
 *
 * Aucune dependance : Node standard library uniquement.
 * Cette passe ne remplace PAS la relecture semantique (passe 2 du skill).
 */
import { writeFileSync } from "node:fs";

// Ordre important : motifs les plus specifiques d'abord.
const PATTERNS = [
  // --- Secrets / cles ---
  [/sk-ant-[A-Za-z0-9_-]{20,}/g, "[ANTHROPIC_KEY]"],
  [/sk-[A-Za-z0-9]{20,}/g, "[API_KEY]"],
  [/\bghp_[A-Za-z0-9]{30,}\b/g, "[GITHUB_TOKEN]"],
  [/\bgithub_pat_[A-Za-z0-9_]{30,}\b/g, "[GITHUB_TOKEN]"],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g, "[SLACK_TOKEN]"],
  [/\bAKIA[0-9A-Z]{16}\b/g, "[AWS_KEY]"],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, "[JWT]"],
  [/(?:password|passwd|secret|token|bearer|api[_-]?key)\s*[:=]\s*[^\s'"]+/gi, "[SECRET]"],

  // --- Identifiants Stripe ---
  [/\b(?:acct|cus|pi|sub|price|prod|in|ch|re|tok|seti|pm|po|tr)_[A-Za-z0-9]{10,}\b/g, "[STRIPE_ID]"],

  // --- Reseau / infra ---
  [/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, "[IP]"],
  [/\b[0-9a-fA-F]{2}(?::[0-9a-fA-F]{2}){5}\b/g, "[MAC]"],
  [/\b(?:[a-zA-Z0-9-]+\.)+(?:bonjour\.fun|bonjour\.alsace|codelsior\.fr)\b/g, "[INTERNAL_HOST]"],

  // --- PII ---
  [/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, "[EMAIL]"],
  [/\b[A-Z]{2}[0-9]{2}(?:[ ]?[A-Z0-9]{4}){2,7}[ ]?[A-Z0-9]{1,3}\b/g, "[IBAN]"],
  [/\b(?:\d[ -]?){15}\d\b/g, "[CARD]"],
  [/(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}\b/g, "[PHONE]"],
];

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => (data += c));
    process.stdin.on("end", () => resolve(data));
  });
}

const text = await readStdin();
const counts = {};
let out = text;
for (const [pattern, repl] of PATTERNS) {
  out = out.replace(pattern, () => {
    counts[repl] = (counts[repl] || 0) + 1;
    return repl;
  });
}

process.stdout.write(out);

const total = Object.values(counts).reduce((a, b) => a + b, 0);
const report = {
  total_redactions: total,
  by_category: counts,
  note:
    "Passe deterministe uniquement. La passe semantique (noms, donnees " +
    "metier) reste a faire manuellement avant publication.",
};
writeFileSync("anonymize_report.json", JSON.stringify(report, null, 2));
process.stderr.write(`[anonymize] ${total} remplacement(s) -> anonymize_report.json\n`);
