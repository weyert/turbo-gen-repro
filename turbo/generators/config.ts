import path from "node:path";
import type { PlopTypes } from "@turbo/gen";
import globby from "globby";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  const baseDirectory = plop.getPlopfilePath();
  const templatesDirectory = path.join(baseDirectory, "templates");

  // create architecture design record
  plop.setGenerator("adr", {
    description: "Create a new architecture design record",
    prompts: [
      {
        type: "input",
        name: "title",
        message: "title of the architecture design record",
        validate: function validate(input: string) {
          return input.length > 8;
        },
      },
      {
        type: "input",
        name: "description",
        message: "description of the architecture design record",
        validate: function validate(input: string) {
          return input.length > 8;
        },
      },
    ],
    actions: function actions(data) {
      const templateFile = path.resolve(
        templatesDirectory,
        "docs/architecture-decisions/adr000-template.md"
      );

      // get a list of files in the ADR files
      const designRecords = globby.globbySync("docs/architecture-decisions/adr*.md");

      // number the this ADR  based on the total adr files
      const nextIdentifier = String(designRecords.length);
      const paddedIdentifier = nextIdentifier.padStart(3, "0");

      // store the adr markdown file
      const generatedPath = `docs/architecture-decisions/adr{{nextIdentifier}}-{{dashCase title}}.md`;

      return [
        {
          type: "add",
          path: generatedPath,
          templateFile,
          data: {
            nextIdentifier: paddedIdentifier,
            ...data,
          },
        },
      ];
    },
  });
}
