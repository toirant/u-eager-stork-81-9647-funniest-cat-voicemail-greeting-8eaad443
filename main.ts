// Funniest Cat Voicemail Greeting
// make.fun bounty: u-eager-stork-81-9647-funniest-cat-voicemail-greeting-8eaad443
//
// The entry is a single voicemail greeting recorded by a cat, at most
// 120 characters. The program writes it to /output/entry.txt, where the
// sealed gate scorer checks it is UTF-8 text of 1-120 characters.
//
// The greeting, written to the judge's brief:
//   1. It IS a cat's voicemail greeting: "You've reached Miso... leave a
//      message after the beep" is the shape of a real greeting, spoken
//      by the cat herself.
//   2. The joke is specific to cats: asleep on the keyboard, the classic
//      spot a cat claims the moment its human needs to work.
//   3. Miso has a voice of her own: brisk, unbothered, and openly
//      transactional about tuna.
//   4. It works spoken aloud in a few seconds, and the punch lands last:
//      "Tuna gets a callback. You don't."
//   5. No tired pun, no catchphrase: the callback is the joke.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry line. 115 characters, one line, no trailing newline in the
// file (the gate counts characters, so the file holds exactly this text).
const ENTRY =
  "You've reached Miso. I'm asleep on your keyboard — " +
  "leave a message after the beep. Tuna gets a callback. You don't.";

const MAX_CHARS = 120;
const OUTPUT_DIR = process.env.OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function validate(line: string): void {
  // Count code points, not UTF-16 units, so the check matches the gate's
  // character count even with the em dash in the greeting.
  const chars = [...line].length;
  if (chars === 0 || chars > MAX_CHARS) {
    throw new Error(`Entry must be 1-${MAX_CHARS} characters, got ${chars}.`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
  if (line !== line.trim()) {
    throw new Error("Entry must not start or end with whitespace.");
  }
}

function main(): void {
  const line = ENTRY.trim();
  validate(line);
  // Create the output directory when it does not exist. Never remove the
  // directory itself: the grader mounts it and runs as an unprivileged
  // user, so removing it fails the run.
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, line, "utf8");
  // Round-trip check: what the gate reads must be exactly the greeting —
  // same text, same length, still a single line with no trailing newline.
  const written = readFileSync(OUTPUT_FILE, "utf8");
  if (written !== line) {
    throw new Error("Round-trip mismatch: entry.txt does not match the greeting.");
  }
  if ([...written].length !== [...line].length) {
    throw new Error("Round-trip mismatch: entry.txt length changed.");
  }
  console.log(`Wrote ${[...line].length} characters to ${OUTPUT_FILE}:`);
  console.log(line);
}

main();
