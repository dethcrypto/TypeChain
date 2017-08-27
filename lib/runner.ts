import * as fs from "fs";
import * as path from "path";
import { RawAbiDefinition } from './abiParser';
import generateDefinitions from './generateDefinitions';

const contractPath = path.join(__dirname, "../contracts/DumbContract.abi");
const inputABI = JSON.parse(fs.readFileSync(contractPath).toString()) as Array<RawAbiDefinition>;

const typings = generateDefinitions("DumbContract", inputABI);

console.log(typings);