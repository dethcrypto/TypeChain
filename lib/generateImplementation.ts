import { Contract } from "./abiParser";

// @todo don't rely on es6 here
export function generateImplementation(contract: Contract, abi: string) {
  const constantGetters = contract.constants.map(
    constant =>
      `get ${constant.name}() { return promisify(this.rawWeb3Contract.${constant.name}, []) }`
  );

  const constantFuncs = contract.constantFunctions.map(constantFunc => {
    return `
      ${constantFunc.name}(...args) { return promisify(this.rawWeb3Contract.${constantFunc.name}, args) }
    `;
  });

  const funcs = contract.functions.map(func => {
    return `
      ${func.name + "Tx"}(...args) { return promisify(this.rawWeb3Contract.${func.name}, args); }
    `;
  });

  return `
  function promisify(func, args) {
    return new Promise((res,rej) => {
      func(...args, (err, data) => {
        if (err) return rej(err);
        return res(data);
      })
    })
  }

  exports.default = class Contract {
    constructor(web3, address) {
      this.rawWeb3Contract = web3.eth.contract(${JSON.stringify(abi)}).at(address);
    }

    static async createAndValidate(web3, address) {
      const contract = new Contract(web3, address);
      const code = await promisify(web3.eth.getCode, [address]);
      if (code === "0x0") {
        throw new Error(\`Contract at \${address} doesn't exist!\`);
      }
      return contract;
    }
    
    ${constantGetters.join("\n")}
    ${constantFuncs.join("\n")}
    ${funcs.join("\n")}
  }
  `;
}
