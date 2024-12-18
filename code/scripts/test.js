const Contracts = artifacts.require('StudentStoage.sol')

module.exports = async function (callback){
  console.log('dd')
  const StudentStoage = await Contracts.deployed();

  await StudentStoage.addList(33,'lele');
  let res = await StudentStoage.getList();
  callback()
}