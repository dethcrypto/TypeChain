import { expect } from "chai";
import { deployContract } from "./utils/web3Contracts";
import { BigNumber } from "bignumber.js";

import { DumbContract } from "./abis/DumbContract";
import { web3, accounts, GAS_LIMIT_STANDARD, createNewBlockchain } from "./web3";

// Some of the event related tests take longer to get called
const LONG_TIMEOUT = 10000;

describe("DumbContract", () => {
  let contractAddress: string;

  beforeEach(async () => {
    contractAddress = (await deployContract("DumbContract")).address;
  });

  it("should allow for calling all methods", async () => {
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

    await dumbContract.countupTx(1).send({ from: accounts[0], gas: GAS_LIMIT_STANDARD });
    dumbContract.countupTx(1).getData();

    expect((await dumbContract.counter).toNumber()).to.be.eq(1);
    expect((await dumbContract.counterWithOffset(new BigNumber(2))).toNumber()).to.be.eq(3);
    expect(await dumbContract.SOME_VALUE).to.be.eq(true);

    await dumbContract.countupTx(2).send({ from: accounts[0], gas: GAS_LIMIT_STANDARD });
    expect((await dumbContract.counterArray(0)).toNumber()).to.be.eq(1);
    expect((await dumbContract.counterArray(1)).toNumber()).to.be.eq(3);

    expect(await dumbContract.someAddress).to.be.eq(accounts[0]);
  });

  it("should allow for calling payable methods", async () => {
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

    await dumbContract
      .countupForEtherTx()
      .send({ from: accounts[0], gas: GAS_LIMIT_STANDARD, value: 10 });

    expect((await dumbContract.counterArray(0)).toNumber()).to.be.eq(10);
  });

  it("should support sending tx via custom web3", async () => {
    const newBlockchain = await createNewBlockchain();
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

    await dumbContract
      .countupForEtherTx()
      .send(
        { from: newBlockchain.accounts[0], gas: GAS_LIMIT_STANDARD, value: 10 },
        newBlockchain.web3,
      );

    // this should reject because tx wasn't properly mined (contract doesn't exist on different chain)
    return expect(dumbContract.counterArray(0)).to.be.rejected;
  });

  it("should serialize numeric arguments", async () => {
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

    // this relies on internal web3 behavior introduced in 0.20
    expect((await dumbContract.counterWithOffset(5)).toString()).to.be.eq("5");
    expect((await dumbContract.counterWithOffset(new BigNumber(5))).toString()).to.be.eq("5");
  });

  it("should fail for not deployed contracts", () => {
    const wrongAddress = "0xbe84036c11964e9743f056f4e780a99d302a77c3";
    return expect(DumbContract.createAndValidate(web3, wrongAddress)).to.be.rejectedWith(
      Error,
      `Contract at ${wrongAddress} doesn't exist!`,
    );
  });

  it("should allow calling a function which takes an array param", async () => {
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

    expect((await dumbContract.arrayParamLength).toString()).to.be.eq("0");

    await dumbContract
      .callWithArrayTx([new BigNumber(41), new BigNumber(42), new BigNumber(43)])
      .send({ from: accounts[0], gas: GAS_LIMIT_STANDARD });

    // Make sure the value has been set as expected
    expect((await dumbContract.arrayParamLength).toString()).to.be.eq("3");
  });

  it("should wait for event", async () => {
    const expectedAccount = accounts[0];
    const expectedValue = 10;

    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

    const waitingEvent = dumbContract
      .DepositEvent({ from: expectedAccount })
      .watchFirst({})
      .then(eventLog => {
        expect(eventLog.args.from).to.eq(expectedAccount);
        expect(eventLog.args.value.toString()).to.eq(expectedValue.toString());
      });

    // Send two transactions, one that shouldn't match the filter and one that should
    const txPromise = dumbContract
      .countupForEtherTx()
      .send({ from: accounts[1], gas: GAS_LIMIT_STANDARD, value: expectedValue })
      .then(() => {
        return dumbContract
          .countupForEtherTx()
          .send({ from: expectedAccount, gas: GAS_LIMIT_STANDARD, value: expectedValue });
      });
    return Promise.all([waitingEvent, txPromise]);
  }).timeout(LONG_TIMEOUT);

  it("should get multiple events", async () => {
    let watchedEventCount = 0;
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

    const expectedCalls = [
      { from: accounts[0], value: 42 },
      { from: accounts[2], value: 96 },
      { from: accounts[2], value: 4 },
    ];

    const transactionHashes = new Array<string>();

    const returnedPromise = new Promise<void>((resolve, reject) => {
      const stopEventWatcher = dumbContract.DepositEvent({}).watch({}, (err, eventLog) => {
        // Validate this is one of the events we're expecting
        const txHashIndex = transactionHashes.indexOf(eventLog.transactionHash);
        expect(txHashIndex).to.not.eq(-1);

        expect(eventLog.args.from).to.eq(expectedCalls[txHashIndex].from);
        expect(eventLog.args.value.toString()).to.eq(expectedCalls[txHashIndex].value.toString());

        watchedEventCount++;

        // If we've seen all the events, then we're done with the test
        if (watchedEventCount === 3) {
          stopEventWatcher()
            .then(resolve)
            .catch(reject);
        }
      });
    });

    for (const expectedCall of expectedCalls) {
      // tslint:disable-next-line:no-floating-promises
      const txHash = await dumbContract
        .countupForEtherTx()
        .send({ from: expectedCall.from, gas: GAS_LIMIT_STANDARD, value: expectedCall.value });
      transactionHashes.push(txHash);
    }

    return returnedPromise;
  }).timeout(LONG_TIMEOUT);

  it("should get only specified events", async () => {
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);
    await dumbContract
      .countupForEtherTx()
      .send({ from: accounts[0], gas: GAS_LIMIT_STANDARD, value: 12 });
    await dumbContract
      .countupForEtherTx()
      .send({ from: accounts[1], gas: GAS_LIMIT_STANDARD, value: 42 });

    const event = dumbContract.DepositEvent({ from: accounts[1] });

    // Pass in a block filter which will not return any events
    const noEvents = await event.get({ fromBlock: 0, toBlock: 0 });
    expect(noEvents.length).to.eq(0);

    // Pass in a block filter which should get our event back
    const singleEvent = await event.get({ fromBlock: 0, toBlock: "latest" });
    expect(singleEvent.length).to.eq(1);
    expect(singleEvent[0].args.from).to.eq(accounts[1]);
  }).timeout(LONG_TIMEOUT);

  it("should allow for strings to be used for byte arrays", async () => {
    const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);
    const byteString = "0xabcd123456000000000000000000000000000000000000000000000000000000";

    await dumbContract
      .callWithBytesTx(byteString)
      .send({ from: accounts[1], gas: GAS_LIMIT_STANDARD });

    const result = await dumbContract.byteArray;

    expect(result).to.be.a("string");
    expect(result).to.eq(byteString);
  });

  describe("estimateGas", () => {
    it("should work", async () => {
      const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

      const estimatedGas = await dumbContract.countupTx(1).estimateGas({ from: accounts[0] });

      expect(estimatedGas).to.be.eq(82573);
    });
  });
});
