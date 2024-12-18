import { useEffect, useState } from 'react'
import Web3 from 'web3'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../static/YydyToken"
import { EXCHANGE_ABI, EXCHANGE_ADDRESS } from "../static/Exchange"
import Balance from './Balance'
import Order from './Order'
import { loadBalanceData } from '../redux/slice/balanceSlice'
import { loadOrderData } from '../redux/slice/orderSlice'
import { useSelector, useDispatch } from 'react-redux'
import { Tag } from 'antd'
export default function Content() {
  const dispatch = useDispatch()
  const [webObj, setWebObj] = useState({}) // 设置账号的状态变量 
  useEffect(() => {
    async function load() {
      let obj = await initWeb3()
      console.log(obj)
      window.webObj = obj
      setWebObj({ ...obj })
      dispatch(loadBalanceData(obj)) //获取余额
      dispatch(loadOrderData(obj)) //获取交易订单

      const OrderSubscription = obj.EXCHANGEToken.events.Order({
        fromBlock: 'latest'
      });
      OrderSubscription.on('data', event=>{
        dispatch(loadOrderData(obj)) //获取交易订单
      })
  
      const CancelSubscription = obj.EXCHANGEToken.events.Cancel({
        fromBlock: 'latest'
      });
      CancelSubscription.on('data', event=>{
        dispatch(loadOrderData(obj)) //获取交易订单
      })

    
      const FinishSubscription = obj.EXCHANGEToken.events.Finish({
        fromBlock: 'latest'
      });
      FinishSubscription.on('data', event=>{
        dispatch(loadBalanceData(obj)) //获取余额
        dispatch(loadOrderData(obj)) //获取交易订单
      })
     

     

    }

    load()
  }, [])

  async function initWeb3() {
    const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:8545")
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    let account = accounts[0]
    window.ethereum.on('accountsChanged', (accounts) => {
      console.log("accounts", accounts)
      window.location.reload()
    })

    const netId = await web3.eth.net.getId()

    const YYDYToken = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS)


    const EXCHANGEToken = new web3.eth.Contract(EXCHANGE_ABI, EXCHANGE_ADDRESS)


    return {
      web3, netId, YYDYToken, EXCHANGEToken, account
    }

  }
  return (
    <div>
      <p>  <Tag color="#2db7f5">当前账号:{webObj.account}</Tag></p>
      <br />
      <Balance />
      <Order />
    </div>
  )


}

