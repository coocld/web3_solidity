import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const loadOrderData = createAsyncThunk(
  'order/fetchOrderdata',
  async (data, { dispatch }) => {
    // console.log(data)
    const {EXCHANGEToken,YYDYToken,account,web3} = data
    const fromWei = (bn)=>{
      return web3.utils.fromWei(bn,'ether');
    } 
    // let list = await EXCHANGEToken.methods.orders(1).call();
    // console.log(list)
    // dispatch.setOrderList(list)
    let Orderlist = await EXCHANGEToken.getPastEvents('Order',{
      fromBlock:0,
      toBlock:'latest'
    })
    
    let returnValues = Orderlist.map(item=>item.returnValues)
    console.log(returnValues) 
    
    let Cancellist = await EXCHANGEToken.getPastEvents('Cancel',{
      fromBlock:0,
      toBlock:'latest'
    })
    // console.log(Cancellist)

    let Finishlist = await EXCHANGEToken.getPastEvents('Finish',{
      fromBlock:0,
      toBlock:'latest'
    })
    // console.log(Finishlist)

    let makeOrderList = Orderlist.map(item=>item.returnValues);
    let CancelAndFinishList = [...Cancellist, ...Finishlist];
    CancelAndFinishList = CancelAndFinishList.map(item=>item.returnValues);
    let CancelAndFinishIds = CancelAndFinishList.map(item=>item.id);
    makeOrderList.forEach((item,index)=>{
      if (CancelAndFinishIds.includes(item.id)){
         delete makeOrderList[index]
      }
    })
    let AllOrderList = [...makeOrderList, ...CancelAndFinishList]
    
    
    let newAllList = []
    AllOrderList.forEach((item)=>{
      if(item&&item.id){
        newAllList.push({
          amountGet: fromWei(item.amountGet),
          amountGive: fromWei(item.amountGive),
          id: item.id.toString(),
          orderStatus: item.orderStatus.toString(),
          timeStemp: item.timeStemp.toString(),
          tokenGet: item.tokenGet.toString(),
          tokenGive: item.tokenGive.toString(),
          user: item.user.toLowerCase(),
        })
      }
     
     
     
    })
    dispatch(setOrderList(newAllList))
    
  }
)

export const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderList: [],
  },
  reducers: {
    setOrderList: (state, action) => {
      state.orderList = action.payload
    },
  
  }
})
export const { setOrderList } = orderSlice.actions

export default orderSlice.reducer

