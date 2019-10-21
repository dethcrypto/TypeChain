pragma solidity ^0.4.24;

library TestLibrary {

    function enhanceVal(uint256 _val) public pure returns (uint256) {
        return _val + 42;
    }

}

contract ContractWithLibrary {

    uint256 public val;

    function setVal(uint256 _val) public {
        val = TestLibrary.enhanceVal(TestLibrary.enhanceVal(_val));
    }

}
