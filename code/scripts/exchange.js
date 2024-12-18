const exchange = artifacts.require('Exchange.sol')
const yydyToken = artifacts.require('YydyToken.sol')
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

const fromWei = (bn)=>{
  return web3.utils.fromWei(bn,'ether');
}

const toWei = (number)=>{
  return web3.utils.toWei(number.toString(),'ether');
}



module.exports = async function (callback){
  const accounts = await web3.eth.getAccounts();
  const YydyToken = await yydyToken.deployed();
  const Exchange = await exchange.deployed();
 

 
  //以太币
  let res2 = await Exchange.depositEther({
    from: accounts[0],
    value: toWei(10)
  }) 
  let res1 = await Exchange.tokens(ETHER_ADDRESS,accounts[0]);
  console.log(fromWei(res1))

  //其他币
  // let res3 = await YydyToken.approve(Exchange.address,toWei(100000),{
  //   from: accounts[0]
  // }) 

  //  let res4 = await Exchange.depositToken(YydyToken.address,toWei(100000),{
  //   from: accounts[0]
  // }) 

  //   let res5 = await Exchange.tokens(YydyToken.address,accounts[0]);
  // console.log(fromWei(res5))

 
  callback()
}