import { writeFileSync } from "fs";
import { parse } from "./abiParser";
import { generateTypingsForContract } from "./generateTypings"
import { generateImplementation } from "./generateImplementation";

export default function loader(source: string): string {
  this.cacheable && this.cacheable();
  this.addDependency(this.resourcePath);
  
  const rawAbi = JSON.parse(source);
  const contract = parse(rawAbi);
  const generatedTyping = generateTypingsForContract(contract);

  return generateImplementation(contract, rawAbi);
}