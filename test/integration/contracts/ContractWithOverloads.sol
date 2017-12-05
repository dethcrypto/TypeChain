pragma solidity ^0.4.4;

contract ContractWithOverloads {
  uint public counter;

  function getCounter() constant public returns(uint) {
    return counter;
  }

  function getCounter(uint offset) constant public returns(uint) {
    return counter + offset;
  }
  
  function increaseCounter() public {
    counter += 1;
  }

  function increaseCounter(uint by) public {
    counter += by;
  }
}
