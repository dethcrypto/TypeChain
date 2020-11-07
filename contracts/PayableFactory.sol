pragma solidity ^0.6.4;

import "./Payable.sol";

contract PayableFactory {
  function newPayable() public returns (Payable) {
        return new Payable();
    }
}
