exports['DumbContract should snapshot generated code 1'] = `
/* tslint:disable */

import { BigNumber } from "bignumber.js";
import * as TC from "./typechain-runtime";

export class DumbContract extends TC.TypeChainContract {
  public readonly rawWeb3Contract: any;

  public constructor(web3: any, address: string | BigNumber) {
    const abi = [
      {
        constant: true,
        inputs: [],
        name: "arrayParamLength",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [],
        name: "countupForEther",
        outputs: [],
        payable: true,
        stateMutability: "payable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "someAddress",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { name: "", type: "uint8" },
          { name: "", type: "uint8" },
          { name: "ret", type: "uint256" },
        ],
        name: "twoUnnamedArgs",
        outputs: [{ name: "", type: "uint256" }],
        payable: true,
        stateMutability: "payable",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "offset", type: "int256" }],
        name: "returnSigned",
        outputs: [{ name: "", type: "int256" }],
        payable: false,
        stateMutability: "pure",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "boolParam", type: "bool" }],
        name: "callWithBoolean",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "pure",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "arrayParam", type: "uint256[]" }],
        name: "callWithArray2",
        outputs: [{ name: "", type: "uint256[]" }],
        payable: false,
        stateMutability: "pure",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "a", type: "address" }],
        name: "testAddress",
        outputs: [{ name: "", type: "address" }],
        payable: false,
        stateMutability: "pure",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "counter",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "a", type: "string" }],
        name: "testString",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "pure",
        type: "function",
      },
      {
        constant: false,
        inputs: [{ name: "byteParam", type: "bytes32" }],
        name: "callWithBytes",
        outputs: [{ name: "", type: "bytes32" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "boolArrayParam", type: "bool[]" }],
        name: "callWithBooleanArray",
        outputs: [{ name: "", type: "bool[]" }],
        payable: false,
        stateMutability: "pure",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "", type: "uint256" }],
        name: "counterArray",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [{ name: "offset", type: "uint256" }],
        name: "countup",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "returnAll",
        outputs: [{ name: "", type: "uint256" }, { name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "SOME_VALUE",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "offset", type: "uint256" }],
        name: "counterWithOffset",
        outputs: [{ name: "sum", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "dynamicByteArray",
        outputs: [{ name: "", type: "bytes" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [{ name: "dynamicBytes", type: "bytes" }],
        name: "callWithDynamicByteArray",
        outputs: [{ name: "", type: "bytes" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "byteArray",
        outputs: [{ name: "", type: "bytes32" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [{ name: "arrayParam", type: "uint256[]" }],
        name: "callWithArray",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "returnSmallUint",
        outputs: [{ name: "", type: "uint8" }],
        payable: false,
        stateMutability: "pure",
        type: "function",
      },
      { inputs: [], payable: false, stateMutability: "nonpayable", type: "constructor" },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "from", type: "address" },
          { indexed: false, name: "value", type: "uint256" },
        ],
        name: "Deposit",
        type: "event",
      },
    ];
    super(web3, address, abi);
  }

  static async createAndValidate(web3: any, address: string | BigNumber): Promise<DumbContract> {
    const contract = new DumbContract(web3, address);
    const code = await TC.promisify(web3.eth.getCode, [address]);

    // in case of missing smartcontract, code can be equal to "0x0" or "0x" depending on exact web3 implementation
    // to cover all these cases we just check against the source code length — there won't be any meaningful EVM program in less then 3 chars
    if (code.length < 4) {
      throw new Error(\`Contract at \${address} doesn't exist!\`);
    }
    return contract;
  }

  public get arrayParamLength(): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.arrayParamLength, []);
  }

  public get someAddress(): Promise<string> {
    return TC.promisify(this.rawWeb3Contract.someAddress, []);
  }

  public get counter(): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.counter, []);
  }

  public get SOME_VALUE(): Promise<boolean> {
    return TC.promisify(this.rawWeb3Contract.SOME_VALUE, []);
  }

  public get dynamicByteArray(): Promise<string> {
    return TC.promisify(this.rawWeb3Contract.dynamicByteArray, []);
  }

  public get byteArray(): Promise<string> {
    return TC.promisify(this.rawWeb3Contract.byteArray, []);
  }

  public get returnSmallUint(): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.returnSmallUint, []);
  }

  public returnSigned(offset: BigNumber | number): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.returnSigned, [offset.toString()]);
  }

  public callWithBoolean(boolParam: boolean): Promise<boolean> {
    return TC.promisify(this.rawWeb3Contract.callWithBoolean, [boolParam]);
  }

  public callWithArray2(arrayParam: BigNumber[]): Promise<BigNumber[]> {
    return TC.promisify(this.rawWeb3Contract.callWithArray2, [
      arrayParam.map(arrayParamElem => arrayParamElem.toString()),
    ]);
  }

  public testAddress(a: BigNumber | string): Promise<string> {
    return TC.promisify(this.rawWeb3Contract.testAddress, [a.toString()]);
  }

  public testString(a: string): Promise<string> {
    return TC.promisify(this.rawWeb3Contract.testString, [a.toString()]);
  }

  public callWithBooleanArray(boolArrayParam: boolean[]): Promise<boolean[]> {
    return TC.promisify(this.rawWeb3Contract.callWithBooleanArray, [
      boolArrayParam.map(boolArrayParamElem => boolArrayParamElem),
    ]);
  }

  public counterArray(arg0: BigNumber | number): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.counterArray, [arg0.toString()]);
  }

  public returnAll(): Promise<[BigNumber, BigNumber]> {
    return TC.promisify(this.rawWeb3Contract.returnAll, []);
  }

  public counterWithOffset(offset: BigNumber | number): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.counterWithOffset, [offset.toString()]);
  }

  public countupForEtherTx(): TC.DeferredTransactionWrapper<TC.IPayableTxParams> {
    return new TC.DeferredTransactionWrapper<TC.IPayableTxParams>(this, "countupForEther", []);
  }
  public twoUnnamedArgsTx(
    arg0: BigNumber | number,
    arg1: BigNumber | number,
    ret: BigNumber | number,
  ): TC.DeferredTransactionWrapper<TC.IPayableTxParams> {
    return new TC.DeferredTransactionWrapper<TC.IPayableTxParams>(this, "twoUnnamedArgs", [
      arg0.toString(),
      arg1.toString(),
      ret.toString(),
    ]);
  }
  public callWithBytesTx(byteParam: string): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(this, "callWithBytes", [
      byteParam.toString(),
    ]);
  }
  public countupTx(offset: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(this, "countup", [offset.toString()]);
  }
  public callWithDynamicByteArrayTx(
    dynamicBytes: string,
  ): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(this, "callWithDynamicByteArray", [
      dynamicBytes.toString(),
    ]);
  }
  public callWithArrayTx(arrayParam: BigNumber[]): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(this, "callWithArray", [
      arrayParam.map(arrayParamElem => arrayParamElem.toString()),
    ]);
  }

  public DepositEvent(eventFilter: {
    from?: BigNumber | string | Array<BigNumber | string>;
  }): TC.DeferredEventWrapper<
    { from: BigNumber | string; value: BigNumber | number },
    { from?: BigNumber | string | Array<BigNumber | string> }
  > {
    return new TC.DeferredEventWrapper<
      { from: BigNumber | string; value: BigNumber | number },
      { from?: BigNumber | string | Array<BigNumber | string> }
    >(this, "Deposit", eventFilter);
  }
}

`
