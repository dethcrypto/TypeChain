pragma solidity ^0.6.4;
pragma experimental ABIEncoderV2;

// useful during integration testing with truffle
contract NAME12mangling {
  function works() public view returns (bool) {
    return true;
  }

  // test name collision
  function provider() public view returns (bool) {
    return true;
  }
}
