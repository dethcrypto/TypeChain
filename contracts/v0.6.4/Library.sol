pragma solidity ^0.6.4;

library Lib {
  enum BOOL {NO, YES}

  function other(BOOL b) public pure returns (BOOL) {
    return b == BOOL.NO ? BOOL.YES : BOOL.NO;
  }
}
