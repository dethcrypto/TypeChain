pragma solidity ^0.4.4;

contract DumbContract {
  uint public counter;
  bool constant public SOME_VALUE = true;

  function DumbContract() public {
    counter = 0;
  }

  function counterWithOffset(uint offset) public constant returns (uint sum) {
    return counter + offset;
  }

  function returnAll() public constant returns (uint, uint) {
    return (counter, counterWithOffset(5));
  }

  function countup() public {
    counter += 1;
  }
}
