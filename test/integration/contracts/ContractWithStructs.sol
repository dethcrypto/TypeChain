pragma solidity ^0.4.4;
pragma experimental ABIEncoderV2;

contract ContractWithStructs {

  struct Person {
    uint height;
    string name;
    address account;
  }

  struct Thing {
    uint counter;
    Person mother;
    Person father;
  }

  Person public owner;
  Thing public thing;

  constructor() public {
    owner = Person(12, "fred", address(0x0));
  }

  function getCounter() constant public returns(uint) {
    return thing.counter;
  }

  function getCounter(uint offset) constant public returns(uint) {
    return thing.counter + offset;
  }
  
  function increaseCounter() public {
    thing.counter += 1;
  }

  function increaseCounter(uint by) public {
    thing.counter += by;
  }

  function setStuff(Person _person, Thing _thing) public {
    owner = _person;
    thing = _thing;
  }

  function getStuff() view public returns (Person _person, Thing _thing) {
    return (owner, thing);
  }
}
