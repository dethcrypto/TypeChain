const DumbContract = artifacts.require("DumbContract");

contract("DumbContract", ([deployer, user1]) => {
  it("should work", async () => {
    const contract = await DumbContract.new({ from: deployer });

    await contract.counterWithOffset(2);
    // await contract.counterArray(0);
    // await contract.returnAll();
  });
});
