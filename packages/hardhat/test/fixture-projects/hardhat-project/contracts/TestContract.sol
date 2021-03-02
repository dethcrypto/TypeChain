pragma solidity 0.7.3;

// import "./libraries/SafeMath.sol";
import "./TestContract1.sol";


contract TestContract {
    TestContract1 tc1;

    // using SafeMath for uint256;

    uint256 amount;

    string message = "placeholder";

    constructor(uint256 _amount) public {
        amount = _amount + 20;
    }
}
