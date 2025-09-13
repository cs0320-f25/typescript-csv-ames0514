import * as fs from "fs";
import * as readline from "readline";
import { ZodError, ZodType } from "zod";

/**
 * This is a JSDoc comment. Similar to JavaDoc, it documents a public-facing
 * function for others to use. Most modern editors will show the comment when 
 * mousing over this function name. Try it in run-parser.ts!
 * 
 * File I/O in TypeScript is "asynchronous", meaning that we can't just
 * read the file and return its contents. You'll learn more about this 
 * in class. For now, just leave the "async" and "await" where they are. 
 * You shouldn't need to alter them.
 * 
 * @param path The path to the file being loaded.
 * @param schema The Zod schema to parse each row of the file with. If
 *   undefined, parses each row as a string array
 * @returns a "promise" to produce a result stored in data or a parsing error
 */
export async function parseCSV<T>(path: string, schema?: ZodType<T>): Promise<{data?: (T[] | string[][]); error?: ZodError}> {
  // This initial block of code reads from a file in Node.js. The "rl"
  // value can be iterated over in a "for" loop. 
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity, // handle different line endings
  });

  // If schema is undefined, parse as raw strings and add values to result
  if (!schema) {
    const result = [];
    for await (const line of rl) {
      const values = line.split(",").map((v) => v.trim());
      result.push(values)
    }
    return {data: result};
  }

  let header: string[] | null = null; // perhaps will need for Sprint 2

  // Create an empty array to hold the results
  let result = [];
  
  // We add the "await" here because file I/O is asynchronous. 
  // We need to force TypeScript to _wait_ for a row before moving on. 
  // More on this in class soon!
  for await (const line of rl) {
    const values = line.split(",").map((v) => v.trim());
    if (!header) {
      header = values;
      continue;
    }
    const parsed = schema.safeParse(values); // zod parses the line
    if (!parsed.success) {
      return {error: parsed.error}
    }
    result.push(parsed.data);
  }
  return {data: result};
}