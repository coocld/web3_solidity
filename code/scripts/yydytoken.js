const Contracts = artifacts.require('YydyToken.sol')

const fromWei = (bn)=>{
  return web3.utils.fromWei(bn,'ether');
}

const toWei = (number)=>{
  return web3.utils.toWei(number.toString(),'ether');
}

module.exports = async function (callback){
 
  const YydyToken = await Contracts.deployed();

 let res1 = await YydyToken.balanceOf('0xa0263b3a72e03A62c971C7b72e17844868992886');
 console.log(fromWei(res1),'账户1-没')
 let res4 = await YydyToken.balanceOf('0xea6f4407c9Ed967A4BFC92acF7aFB7Bcc43D9C5b');
 console.log(fromWei(res4),'账户2-没')

 let res2 = await YydyToken.transfer('0xea6f4407c9Ed967A4BFC92acF7aFB7Bcc43D9C5b', toWei(10000))


 console.log(res2,'转完成')
 let res3 = await YydyToken.balanceOf('0xa0263b3a72e03A62c971C7b72e17844868992886');
 console.log(fromWei(res3),'账户1-已')

 let res5 = await YydyToken.balanceOf('0xea6f4407c9Ed967A4BFC92acF7aFB7Bcc43D9C5b');
 console.log(fromWei(res5),'账户2-已')
 
  callback()
}