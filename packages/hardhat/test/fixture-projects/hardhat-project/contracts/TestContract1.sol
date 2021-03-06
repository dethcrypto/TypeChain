pragma solidity 0.7.3;


contract TestContract1 {
    uint256 amount;

    string message = "placeholder";

    constructor(uint256 _amount) public {
        amount = _amount;
    }
}
