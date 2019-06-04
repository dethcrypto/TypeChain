import { deployContract } from "./ethers";
import { DumbContract } from "./types/ethers-contracts/DumbContract";
import { BigNumber } from "ethers/utils";

import { expect } from "chai";
import { Event } from "ethers";

describe("DumbContract", () => {
  it("should work", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    const res = await contract.functions.returnAll();
    expect(res).to.be.deep.eq([new BigNumber("0"), new BigNumber("5")]);
  });

  it("should have an address", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(contract.address).to.be.string;
  });

  it("should allow to pass unsigned values in multiple ways", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    await contract.functions.countup(2);
    expect(await contract.functions.counter()).to.be.deep.eq(new BigNumber("2"));
    await contract.functions.countup("2");
    expect(await contract.functions.counter()).to.be.deep.eq(new BigNumber("4"));
  });

  it("should allow to pass signed values in multiple ways", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(await contract.functions.returnSigned(2)).to.be.deep.eq(new BigNumber("2"));
    expect(await contract.functions.returnSigned("2")).to.be.deep.eq(new BigNumber("2"));
  });

  it("should allow to pass address values", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(
      await contract.functions.testAddress("0x0000000000000000000000000000000000000123"),
    ).to.be.eq("0x0000000000000000000000000000000000000123");
  });

  it("should allow to pass bytes values", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    await contract.functions.callWithBytes(
      "0x0100010000000000000000000000000000000000000000000000000000000000",
    );
  });

  it("should allow to pass boolean values", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    const res = await contract.functions.callWithBoolean(true);
    expect(res).to.be.deep.eq(true);
  });

  it("should allow to pass numeric arrays values in multiple ways", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    const res = await contract.functions.callWithArray2(["1", 2]);
    expect(res).to.be.deep.eq([new BigNumber("1"), new BigNumber("2")]);
  });

  it("should allow to pass strings ", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(await contract.functions.testString("abc")).to.be.deep.eq("abc");
  });

  it("should allow to pass overrides", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;
    const value = 1;
    const gasPrice = 33;

    const tx = await contract.functions.countupForEther({ value, gasPrice });

    expect(tx.value).to.be.deep.eq(new BigNumber(value));
    expect(tx.gasPrice).to.be.deep.eq(new BigNumber(gasPrice));
  });

  it("should return number for small ints", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(await contract.functions.returnSmallUint()).to.be.eq(18);
  });

  it("should .attach to another contract instance", async () => {
    const contract1 = (await deployContract("DumbContract")) as DumbContract;
    const contract2 = (await deployContract("DumbContract")) as DumbContract;

    await contract1.functions.countup(2);
    const reconnectedContract = contract2.attach(contract1.address);
    expect(await reconnectedContract.functions.counter()).to.be.deep.eq(new BigNumber("2"));
  });

  it("should estimate tx gas cost", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect((await contract.estimate.countup(2)).toNumber()).to.be.greaterThan(22000);
  });

  it("should encode a tx", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(await contract.interface.functions.countup.encode([2])).to.eq(
      "0x7916df080000000000000000000000000000000000000000000000000000000000000002",
    );
  });

  it("should encode event topics", async () => {
    const contract = (await deployContract("DumbContract")) as DumbContract;

    expect(
      await contract.interface.events.Deposit.encodeTopics([
        "0x0000000000000000000000000000000000000123",
        null,
      ]),
    ).to.deep.eq([
      "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c",
      "0x0000000000000000000000000000000000000000000000000000000000000123",
    ]);
  });

  it("should listen for an event", async function(this) {
    this.timeout(10000); // the listener isn't called within the default 2000ms
    const contract = (await deployContract("DumbContract")) as DumbContract;
    const value = 42;
    const signerAddress = await contract.signer.getAddress();

    let eventListenedResolveFn: () => void;

    contract.on("Deposit", (eventFrom: string, eventValue: BigNumber, event: Event) => {
      expect(eventFrom).to.eq(signerAddress);
      expect(eventValue.toNumber()).to.eq(value);
      event.removeListener();
      eventListenedResolveFn();
    });

    await contract.functions.countupForEther({ value });
    // tslint:disable-next-line:promise-must-complete
    await new Promise(resolve => {
      eventListenedResolveFn = resolve;
    });
  });
});
