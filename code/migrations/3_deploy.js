const Contracts = artifacts.require('Exchange.sol')

module.exports = async function (deployer){
  const accounts = await web3.eth.getAccounts();

  await deployer.deploy(Contracts, accounts[2], 10)
}