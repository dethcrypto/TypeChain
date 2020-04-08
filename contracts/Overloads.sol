pragma solidity ^0.6.4;

contract Overloads {
  function overload1(int256 input1) public pure returns (int256) {
    return input1;
  }

  function overload1(uint256 input1, uint256 input2) public pure returns (uint256) {
    return input1+input2;
  }
}
