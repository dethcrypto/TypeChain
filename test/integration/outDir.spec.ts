import { readdirSync } from "fs";
import { join } from "path";
import { expect } from "chai";

// files were already created by test.sh
// we could really use some better integration testing setup (like mocking fs for example)
describe("--outDir", () => {
  it("should generate exactly 3 files", () => {
    const outputPath = join(__dirname, "../../test-tmp/");
    const files = readdirSync(outputPath);
    expect(files).to.have.length(3);
  });
});
