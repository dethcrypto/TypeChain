pragma solidity ^0.8.9;
pragma experimental ABIEncoderV2;


library Issue552_Observer {

  struct Observation {
    int val;
    uint blockTimestamp;
  }

  function write(
    Observation[65535] storage self,
    uint16 index,
    uint newVal,
    uint blockTimestamp
  ) internal returns (uint16 indexUpdated) { }
}


// This is used to crash TypeChain Ethers v5 with "Reached heap limit Allocation failed"
contract Issue552_Reproduction {
  using Issue552_Observer for Issue552_Observer.Observation[65535];

  struct ObservationParams {
    Issue552_Observer.Observation[65535] observations;
    uint16 index;
  }

  struct Bar {
    ObservationParams fooObservations;
  }

  mapping(uint => Bar) public bars; 

  function makeObservation(uint barId, uint newVal) external {}

  function input(uint256[10] calldata values) public pure {}
}
