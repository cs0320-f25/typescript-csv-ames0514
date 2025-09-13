# Sprint 1: TypeScript CSV

### Task C: Proposing Enhancement

- #### Step 1: Brainstorm on your own.
    - As a user, I can include multiple comma-separated items within a single field to be treated as one object so I can have more flexibility in how data is grouped and processed.
        - Acceptance criteria:
            - Fields enclosed in quotes are parsed as a single object (not split).
            - The parser does not break when encountering these embedded commas.
    - As a user, I can include different types of inputs (strings, numbers, booleans) in my CSV file so I don't have to be confined to only providing items of one data type and can make my csv produce more meaningful outputs.
        - Acceptance criteria:
            - The parser uses a schema validation tool (like Zod) to infer types for each field.
            - If a value does not match the zod-inferred type, an appropriate error is returned.
            - The user can override or provide a schema to the developer if a type inference isn't exactly like what they wanted.
    - As a user, I can choose whether or not I have a header for my csv file, so I can have a correctly interpreted data that doesn't require manual configuration.
        - Acceptance criteria:
            - The parser will automatically check if the first row is a header row.
            - If a header is detected, the parser will configure it as keys for the data and will not interpret it as data.
            - If the first row isn't a header row, the parser will interpret every following row as data.
    - As a user, I can include empty values when I choose to omit certain fields, so I can still add items even if some information is missing.
        - Acceptance criteria:
            - Empty fields should still be parsed (as an empty string or null, whatever seems more appropriate)
            - The parser throws an error for missing fields.

- #### Step 2: Use an LLM to help expand your perspective.
    - It did brainstorm most of what I listed out above, except it didn't suggest handling with the empty value edge case nor using zod for inferring the different input types (probably because I didn't ask for that much specificity). It also told me to make sure I account for different delimiters, which I don't think is a relevant suggestion as a CSV parser should expect to only be given csv files with commas.
    In terms of additional features, it suggested adding line endings to handle (\n, \r\n), skipping empty lines or allow users to decide whether they want to include them when parsing, handling "multi\nline" values properly inside quotes and handling invalid multiline fields appropriately.

- #### Step 3: use an LLM to help expand your perspective.

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 

    Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.) 

    - In subsequent runs, it gave similar suggestions but never the same combinations. It suggested the case handling of empty values and also returning raw arrays once line(s) are parsed, and additionally handling escaped quotes inside quoted fields properly (He said ""Hello"")
### Design Choices
I decided to allow the user to pass in an optional schema field in the input so they can better specify how they want their input to be parsed. To handle when things go wrong, I extended the return type of parseCSV to also include an error field, which forwards the ZodError produced by safeParse to the user. This enables the user to decide exactly what they want to do if their data is invalid. I also added custom error messages so that the user can know what went wrong. My code is also designed so that it returns the first error that it encounters.

### 1340 Supplement

- #### 1. Correctness
A "correct" parser should process every input and no characters/parts of the
input should get lost or added. The number of inputs should be intact, meaning
that every row of the parser should have the same number of fields as the header
row (if exists). In terms of *how* we parse "correctly," empty fields should
still be parsed (as an empty string or null, whatever seems more appropriate).
Also, invalid syntax (handled by Zod) should be error-handled properly so the
user clearly knows why their input is invalid, given their supplied data and the
rules defined in their schema.
- #### 2. Random, On-Demand Generation
If a function randomly produced CSV data on demand, I could use it to expand the
power of my testing by automatically supplying very diverse and unpredictable
test cases. I can also use them as my test data without having to produce them
myself (convenience) and evaluate how well my CSV parser performs on randomly
produced data. This could also help me find edge cases that I didn't consider nor
cover with my self-produced data.

- #### 3. Overall experience, Bugs encountered and resolved
#### Overall Experience: I've never worked with TypeScript before
Most of this project was me learning and familiarizing myself with the type
system and function/error conventions. Unlike previous programming assignments
that required fully functional submissions, this sprint is different in that we
are not expected to fix the CSV parser now, but to establish a good foundation to
address it in the next sprint.
#### Errors/Bugs:
I encountered a lot of Zod type errors. Most notably, I tried using ZodTypeAny
and my return type was unknown, so I fixed it by changing ZodTypeAny to
ZodType<T> (stack overflow search).
#### Tests:
I made four new csv files to test whether specific invalid fields return their
corresponding error messages. In particular, badclassroster.csv has an age field
that is a spelled out as string, which correctly returns an "Age must be an int"
error; badclassroster2.csv returns an "invalid class department code (CSCI)"
error for a class that only has "cs"; badclassroster3.csv returns an "invalid
class number" error for a course that isn't 0200, 0220, or 0300; and
badclassroster4.csv returns a "missing field error" for an missing field. I made
separate test csv files because my parser is designed to return an eror for the
first invalid field it encounters. This way, I can isolate and verify that each
specific error is detected correctly when I make edge case changes to the parser.
#### How to:
run "npm test" to run my tests


#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
Kelly Jeong for the very initial brianstorming and task familiarizing process.
ChatGPT for brainstorming enhancements, as described above, and brainstorming
ideas for the 'corretness' written response.
Claude for error handling and understanding type error messages.
#### Total estimated time it took to complete project:
6 hours
#### Link to GitHub Repo:  
https://github.com/cs0320-f25/typescript-csv-ames0514.git