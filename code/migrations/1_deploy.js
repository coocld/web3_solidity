const Contracts = artifacts.require('StudentStoage.sol')

module.exports = function (deployer){
  deployer.deploy(Contracts)
}