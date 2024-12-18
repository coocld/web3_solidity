const Contracts = artifacts.require('YydyToken.sol')

module.exports = function (deployer){
  deployer.deploy(Contracts)
}