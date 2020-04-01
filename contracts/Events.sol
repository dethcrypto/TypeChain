pragma solidity ^0.6.4;

contract Events {
  event Event1(
    uint256 indexed value1,
    uint256 value2
  );

  function emit_event1() public {
    emit Event1(1, 2);
  }

  // @TODO overriden event


  event AnonEvent1(
    uint256 indexed value1
  ) anonymous;

  function emit_anon1() public {
    emit AnonEvent1(1);
  }
}
