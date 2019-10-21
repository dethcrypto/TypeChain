import { expect } from 'chai';

import { getTestSigner } from './ethers';
import { ContractWithLibrary } from './types/ethers-contracts/ContractWithLibrary';
import {
    ContractWithLibraryFactory,
    ContractWithLibraryLibraryAddresses,
} from './types/ethers-contracts/ContractWithLibraryFactory';
import { TestLibrary } from './types/ethers-contracts/TestLibrary';
import { TestLibraryFactory } from './types/ethers-contracts/TestLibraryFactory';

describe("ContractWithLibrary", () => {

  let testLibrary: TestLibrary;
  let contract: ContractWithLibrary;

  it("should deploy the test library", async () => {
    const factory = new TestLibraryFactory(getTestSigner());
    testLibrary = await factory.deploy();
    expect(testLibrary.address).to.match(/^0x[0-9a-fA-F]{40}$/);
  });

  it("should check the library works", async () => {
    expect((await testLibrary.enhanceVal(0)).toNumber()).to.eq(42);
  });

  it("should link contract bytecode", () => {
    const linkedBytecode = ContractWithLibraryFactory.linkBytecode({
      "__./ContractWithLibrary.sol:TestLibrar__": testLibrary.address,
    });
    expect(linkedBytecode).to.match(/^0x[0-9a-f]{100,}$/);  // no more link placeholders
    const trimmedLibraryAddress = testLibrary.address.replace(/^0x/, "").toLowerCase();
    const matchedAddresses = linkedBytecode.match(new RegExp(trimmedLibraryAddress, "g"));
    expect(matchedAddresses).not.to.be.undefined;
    expect(matchedAddresses!.length).to.eq(2);
  });

  it("should deploy the contract with the library linked", async () => {
    const linkAddresses: ContractWithLibraryLibraryAddresses = {
      "__./ContractWithLibrary.sol:TestLibrar__": testLibrary.address,
    };
    const factory = new ContractWithLibraryFactory(linkAddresses, getTestSigner());
    contract = await factory.deploy();
    expect(contract.address).to.match(/^0x[0-9a-fA-F]{40}$/);
  });

  it("should check the contract using the library works", async () => {
    await contract.setVal(336);
    expect((await contract.val()).toNumber()).to.eq(420);
  });

});
