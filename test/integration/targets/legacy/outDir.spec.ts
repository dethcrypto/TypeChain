import { readdirSync } from "fs";
import { join } from "path";
import { expect } from "chai";

describe("--outDir", () => {
  it("should generate exactly 3 files", () => {
    const outputPath = join(__dirname, "./wrappers");
    const files = readdirSync(outputPath);
    expect(files).to.have.length(4);
  });
});
