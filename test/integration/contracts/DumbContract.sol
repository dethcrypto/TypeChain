pragma solidity ^0.4.4;

contract DumbContract {
  uint public counter;
  bool constant public SOME_VALUE = true;
  uint[] public counterArray;
  address public someAddress;
  uint public arrayParamLength;

  function DumbContract() public {
    counter = 0;
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

  function callWithBytes(bytes byteArray) public pure returns (uint) {
    return byteArray.length;
  }
  
  event Deposit(
    address indexed from,
    uint value
  );
}
