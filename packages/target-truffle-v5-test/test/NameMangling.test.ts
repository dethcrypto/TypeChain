const NameMangling = artifacts.require('NAME12mangling')

contract('NameMangling', ([deployer]) => {
  it('works', async () => {
    const contract = await NameMangling.new({ from: deployer })

    expect(await contract.works()).to.be.true
  })
})
