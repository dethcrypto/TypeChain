import { check, resolveConfig } from "prettier";
import { expect } from "chai";
import * as glob from "glob";
import { readFileSync } from "fs";
import { join } from "path";

describe("Formatting of generated files", () => {
  it("should be done based on prettier config", async () => {
    const config = await resolveConfig(__dirname);

    const files = glob.sync(join(__dirname, "./abis/*.ts"), { absolute: true });

    files.forEach(filePath => {
      expect(
        check(readFileSync(join(__dirname, "./abis/ContractWithOverloads.ts"), "utf-8"), config!),
      ).to.be.ok;
    });
  });
});
