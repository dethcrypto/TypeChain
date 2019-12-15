pragma solidity ^0.4.4;

contract DumbContract {
  uint public counter;
  bool constant public SOME_VALUE = true;
  uint[] public counterArray;
  address public someAddress;
  uint public arrayParamLength;
  bytes32 public byteArray;
  bytes public dynamicByteArray;

  constructor(uint initialCounter) public {
    counter = initialCounter;
    someAddress = msg.sender;
  }

  function counterWithOffset(uint offset) public constant returns (uint sum) {
    return counter + offset;
  }

  function returnAll() public constant returns (uint, uint) {
    return (counter, counterWithOffset(5));
  }

  // typechain doesnt support function overloading currently
  // function countup() public {
  //   counter += 1;
  //   counterArray.push(counter);
  // }

  function countup(uint offset) public {
    counter += offset;
    counterArray.push(counter);
  }

  function returnSigned(int offset) pure public returns (int) {
    return offset;
  }

  // repro for https://github.com/ethereum-ts/TypeChain/issues/142
  function returnSmallUint() pure public returns (uint8) {
    return 18;
  }

  function countupForEther() payable public {
    counter += msg.value;
    counterArray.push(counter);
    emit Deposit(msg.sender, msg.value);
  }

  // repro for https://github.com/Neufund/TypeChain/issues/29
  function twoUnnamedArgs(uint8, uint8, uint ret) payable public returns (uint) {
    return ret;
  }

  // repro for https://github.com/Neufund/TypeChain/issues/39
  function callWithArray(uint256[] arrayParam) public returns (uint) {
    arrayParamLength = arrayParam.length;
    return arrayParam.length;
  }

  function callWithArray2(uint256[] arrayParam) pure public returns (uint256[]) {
    return arrayParam;
  }

  function callWithBytes(bytes32 byteParam) public returns (bytes32) {
    byteArray = byteParam;
    return byteArray;
  }

  function callWithDynamicByteArray(bytes dynamicBytes) public returns (bytes) {
    dynamicByteArray = dynamicBytes;
    return dynamicByteArray;
  }

  function callWithBoolean(bool boolParam) public pure returns (bool) {
    boolParam = boolParam;
    return boolParam;
  }

  function callWithBooleanArray(bool[] boolArrayParam) public pure returns (bool[]) {
    boolArrayParam = boolArrayParam;
    return boolArrayParam;
  }

  function testAddress(address a) pure public returns (address) {
    return a;
  }

  function testString(string a) pure public returns (string) {
    return a;
  }

  function testVoidReturn() pure public {}

  // this is useful to ensure that small ints are handled properly (sometimes they are represented in a different way than bigger ones)
  function testSmallUint() pure public returns (uint8) {
    return 5;
  }

  event Deposit(
    address indexed from,
    uint value
  );
}
