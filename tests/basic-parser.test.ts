import { parseCSV } from "../src/basic-parser";
import * as path from "path";
import { z } from "zod";

const classNumbers = ['0220', '0300', '0320']

const ClassCodeSchema = z.string().refine(c => 
  {
    const s = c.split(' ')
    return s[0].toUpperCase() === 'CSCI'
  }, { message: "Class department must be CSCI (case insensitive)" }
).refine(c =>
  {
    const s = c.split(' ')
    return classNumbers.includes(s[1])
  }, { message: "Class number must be one of 0220, 0300, or 0320" }
)

const AgeSchema = z.coerce.number({ message: "Age must be an integer" })

const NameSchema = z.string()

export const PersonRowSchema = z.tuple([NameSchema, AgeSchema, ClassCodeSchema])
                         .transform( tup => ({name: tup[0], age: tup[1], class: tup[2]}))

export const BasicPersonRowSchema = z.tuple([NameSchema, AgeSchema])
                                    .transform( tup => ({name: tup[0], age: tup[1]}))

export type Person = z.infer<typeof PersonRowSchema>;
export type BasicPerson = z.infer<typeof BasicPersonRowSchema>;

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
const CLASSROSTER_CSV_PATH = path.join(__dirname, "../data/classroster.csv");
const BADCLASSROSTER_CSV_PATH = path.join(__dirname, "../data/badclassroster.csv");
const BADCLASSROSTER2_CSV_PATH = path.join(__dirname, "../data/badclassroster2.csv");
const BADCLASSROSTER3_CSV_PATH = path.join(__dirname, "../data/badclassroster3.csv");
const BADCLASSROSTER4_CSV_PATH = path.join(__dirname, "../data/badclassroster4.csv");

test("parseCSV works given a schema", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, BasicPersonRowSchema)
  const data = results.data!
  
  expect(data).toHaveLength(4);
  expect(data[0]).toEqual({"age": 23, "name": "Alice"});
  expect(data[1]).toEqual({"age": 30, "name": "Bob"});
  expect(data[2]).toEqual({"age": 25, "name": "Charlie"});
  expect(data[3]).toEqual({"age": 22, "name": "Nim"});
});

test("parseCSV works with no schema", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH)
  const data = results.data!

  for(const row of data) {
    expect(Array.isArray(row)).toBe(true);
  }
});

test("parseCSV works on custom schema", async () => {
  const results = await parseCSV(CLASSROSTER_CSV_PATH, PersonRowSchema)
  const data = results.data!
  
  expect(data).toHaveLength(6); // skips header
  expect(data[0]).toEqual({"name": "Amy", "age": 24, "class": "CSCI 0320"});
  expect(data[1]).toEqual({ "name": "amanda kumar", "age": 22, "class": "CSCI 0300" });
  expect(data[2]).toEqual({ "name": "bobby", "age": 24, "class": "csci 0320" });
  expect(data[3]).toEqual({ "name": "Peter", "age": 36, "class": "CSCI 0220" });
  expect(data[4]).toEqual({ "name": "Christina", "age": 23, "class": "CSCI 0320" });
  expect(data[5]).toEqual({ "name": "Charlie", "age": 20, "class": "CSCI 0220" });
});

test("parseCSV returns age error", async () => {
  const results = await parseCSV(BADCLASSROSTER_CSV_PATH, PersonRowSchema)
  
  expect(results.error).toBeDefined;
 
  expect(results.error!.issues[0].message).toEqual("Age must be an integer")
});

test("parseCSV returns class department error", async () => {
  const results = await parseCSV(BADCLASSROSTER2_CSV_PATH, PersonRowSchema)
  
  expect(results.error).toBeDefined;
 
  expect(results.error!.issues[0].message)
    .toEqual("Class department must be CSCI (case insensitive)")
});

test("parseCSV returns class number error", async () => {
  const results = await parseCSV(BADCLASSROSTER3_CSV_PATH, PersonRowSchema)
  
  expect(results.error).toBeDefined;
 
  expect(results.error!.issues[0].message)
    .toEqual("Class number must be one of 0220, 0300, or 0320")
});

test("parseCSV returns missing field error", async () => {
  const results = await parseCSV(BADCLASSROSTER4_CSV_PATH, PersonRowSchema)
  
  expect(results.error).toBeDefined;
 
  expect(results.error!.issues[0].message)
    .toEqual("Invalid input: expected string, received undefined")
});