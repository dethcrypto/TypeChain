pragma solidity ^0.6.4;


contract Events {
  event Event1(uint256 indexed value1, uint256 value2);

  function emit_event1() public {
    emit Event1(1, 2);
  }

  // note: no names for args
  event Event2(uint256);

  function emit_event2() public {
    emit Event2(1);
  }

  event AnonEvent1(uint256 indexed value1) anonymous;

  function emit_anon1() public {
    emit AnonEvent1(1);
  }

  // @TODO overriden event
}
