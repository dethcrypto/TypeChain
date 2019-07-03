import { ContractWithStructs } from "./types/ethers-contracts/ContractWithStructs";
import { ContractWithStructsFactory } from "./types/ethers-contracts/ContractWithStructsFactory";
import { BigNumber } from "ethers/utils";
import { expect } from "chai";
import { getTestSigner } from "./ethers";

describe("ContractWithStructs", () => {
  function deployContractWithStructs(): Promise<ContractWithStructs> {
    return new ContractWithStructsFactory(getTestSigner()).deploy();
  }

  it("should work", async () => {
    const contract = await deployContractWithStructs();

    const res = await contract.functions.getCounter(1);
    expect(res).to.be.deep.eq(new BigNumber("1"));
  });

  it("should have an address", async () => {
    const contract = await deployContractWithStructs();

    expect(contract.address).to.be.string;
  });

  it("should return structs in output", async () => {
    const contract = await deployContractWithStructs();

    const output = await contract.functions.getStuff();
    expect(output._person.height).to.be.deep.eq(new BigNumber("12"));
    expect(output._person.name).to.be.eq("fred");
  });

  it("should accepts structs in input", async () => {
    const contract = await deployContractWithStructs();

    await contract.functions.setStuff(
      { height: 10, name: "bob", account: contract.address },
      {
        counter: 7,
        mother: { height: 8, name: "mary", account: contract.address },
        father: { height: 12, name: "jim", account: contract.address },
      },
    );

    const output = await contract.functions.getStuff();
    expect(output._person.height).to.be.deep.eq(new BigNumber("10"));
    expect(output._person.name).to.be.eq("bob");
    expect(output._thing.counter).to.be.deep.eq(new BigNumber("7"));
    expect(output._thing.mother.name).to.be.eq("mary");
    expect(output._thing.mother.height).to.be.deep.eq(new BigNumber("8"));
    expect(output._thing.father.name).to.be.eq("jim");
    expect(output._thing.father.height).to.be.deep.eq(new BigNumber("12"));
  });
});
