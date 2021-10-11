pragma solidity ^0.6.4;

import './Library.sol';

contract LibraryConsumer {

  Lib.BOOL boolean;

  function someOther(Lib.BOOL b) public pure returns(Lib.BOOL) {
    return Lib.other(b);
  }
}
