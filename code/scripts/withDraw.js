const exchange = artifacts.require('Exchange.sol')
const yydyToken = artifacts.require('YydyToken.sol')
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

const fromWei = (bn)=>{
  return web3.utils.fromWei(bn,'ether');
}

const toWei = (number)=>{
  return web3.utils.toWei(number.toString(),'ether');
}

const wait = (timeout)=>{
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  })
}



module.exports = async function (callback){
  const accounts = await web3.eth.getAccounts();
  const YydyToken = await yydyToken.deployed();
  const Exchange = await exchange.deployed();

  await YydyToken.transfer(accounts[1], toWei(100000),{
    from: accounts[0]
  })
 


 
  // //以太币
  //存
  await Exchange.depositEther({
    from: accounts[0],
    value: toWei(100)
  }) 

  //提
  // await Exchange.withDrawEther(toWei(5),{
  //   from: accounts[0]
  // }) 

  let res1 = await Exchange.tokens(ETHER_ADDRESS,accounts[0]);
  console.log('accounts[0]交易所ETH:' + fromWei(res1))

  

  // //其他币
  //存
  await YydyToken.approve(Exchange.address,toWei(100000),{
    from: accounts[0]
  }) 

  await Exchange.depositToken(YydyToken.address,toWei(100000),{
    from: accounts[0]
  }) 

  //提
  // await Exchange.withDrawToken(YydyToken.address,toWei(50000),{
  //   from: accounts[0]
  // }) 

  let res5 = await Exchange.tokens(YydyToken.address,accounts[0]);
  console.log('accounts[0]交易所YYDY:' + fromWei(res5))


  await Exchange.depositEther({
    from: accounts[1],
    value: toWei(50)
  }) 

  let res2 = await Exchange.tokens(ETHER_ADDRESS,accounts[1]);
  console.log('accounts[1]交易所ETH:' + fromWei(res2))


  await YydyToken.approve(Exchange.address,toWei(50000),{
    from: accounts[1]
  }) 

  await Exchange.depositToken(YydyToken.address,toWei(50000),{
    from: accounts[1]
  }) 

  let res6 = await Exchange.tokens(YydyToken.address,accounts[1]);
  console.log('accounts[1]交易所YYDY:' + fromWei(res6))

  let orderId = 0; 

  // //用0.1个eth 换取 1w个yy， accounts[0]地址创建的
  let res7 = await Exchange.makerOrder(YydyToken.address, toWei(1000), ETHER_ADDRESS, toWei(0.1),{
    from: accounts[0]
  }); 
  orderId = res7.logs[0].args.id;
  console.log('只创建一个订单id：'+ orderId);
  await wait(1000);

  let res8 = await Exchange.makerOrder(YydyToken.address, toWei(2000), ETHER_ADDRESS, toWei(0.2),{
    from: accounts[0]
  });
  orderId = res8.logs[0].args.id;
  console.log('创建一个取消订单id：'+ orderId);
  await Exchange.cancelOrder(orderId,{
    from: accounts[0]
  }); 
  console.log('取消一个订单id：'+ orderId);
  await wait(1000);


  let res9 = await Exchange.makerOrder(YydyToken.address, toWei(3000), ETHER_ADDRESS, toWei(0.3),{
    from: accounts[0]
  });
  orderId = res9.logs[0].args.id;
  console.log('创建一个完成订单id：'+ orderId);
  await wait(1000);

  await Exchange.finishOrder(orderId,{
    from: accounts[1]
  });
  console.log(' 完成一个订单id：'+ orderId);

  
  let res11 = await Exchange.tokens(ETHER_ADDRESS,accounts[0]);
  console.log('accounts[0]交易所ETH:' + fromWei(res11))
  let res10 = await Exchange.tokens(YydyToken.address,accounts[0]);
  console.log('accounts[0]交易所YYDY:' + fromWei(res10))



  let res13 = await Exchange.tokens(ETHER_ADDRESS,accounts[1]);
  console.log('accounts[1]交易所ETH:' + fromWei(res13))
  let res12 = await Exchange.tokens(YydyToken.address,accounts[1]);
  console.log('accounts[1]交易所YYDY:' + fromWei(res12))



  let res14 = await Exchange.tokens(YydyToken.address,accounts[2]);
  console.log('accounts[2]收费交易所YYDY:' + fromWei(res14))

 
  callback()
}