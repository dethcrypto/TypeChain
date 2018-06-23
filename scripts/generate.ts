import { generateTypeChainWrappers } from "../lib/generateTypeChainWrappers";

async function main() {
  await generateTypeChainWrappers({
    glob: "**/*.abi",
    force: true,
  });
}

main().catch(console.error);
