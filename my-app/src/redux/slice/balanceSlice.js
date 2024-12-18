import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'


export const loadBalanceData = createAsyncThunk(
  'balance/fetchBalancedata',
  async(data, {dispatch})=>{
    // console.log(data)
    const {EXCHANGEToken,YYDYToken,account,web3} = data
    const fromWei = (bn)=>{
      return web3.utils.fromWei(bn,'ether');
    } 
    const toWei = (number)=>{
      return web3.utils.toWei(number.toString(),'ether');
    }
    //YYDYToken
    const YYDYTokenWalltBalance = await YYDYToken.methods.balanceOf(account).call() 
    dispatch(setTokenWallet(fromWei(YYDYTokenWalltBalance))) //钱包余额yydy

    const EXCHANGETokenBalance = await EXCHANGEToken.methods.balanceOf(YYDYToken._address, account).call()
    dispatch(setTokenExchange(fromWei(EXCHANGETokenBalance))) //交易所余额yydy

    //ETHERToken
    const EtherWalletBalance = await web3.eth.getBalance(account);
    dispatch(setEtherWallet(fromWei(EtherWalletBalance))) //钱包余额eth

      let EtherExchangeBalance = await EXCHANGEToken.methods.balanceOf(ETHER_ADDRESS,account).call();
      dispatch(setEtherExchange(fromWei(EtherExchangeBalance))) //交易所余额eth
  }
)

export const balanceSlice = createSlice({
  name: 'balance',
  initialState: {
    TokenWallet: '0',//钱包余额yydy
    TokenExchange: '0',//交易所余额yydy
    EtherWallet: '0',//钱包余额eth
    EtherExchange: '0',//交易所余额eth
  },
  reducers: {
    setTokenWallet: (state, action) => {
      state.TokenWallet = action.payload
    },
    setTokenExchange: (state, action) => {
      state.TokenExchange = action.payload
    }, 
    setEtherWallet: (state, action) => {
      state.EtherWallet = action.payload
    }, 
    setEtherExchange: (state, action) => {
      state.EtherExchange = action.payload
    },
  }
})
export const { setTokenWallet, setTokenExchange, setEtherWallet,setEtherExchange } = balanceSlice.actions

export default balanceSlice.reducer

