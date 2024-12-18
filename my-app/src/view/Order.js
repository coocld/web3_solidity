import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Table, Tag, Modal, Form, Input } from 'antd'


function getTime(time) {
  var date = new Date(time * 1000)
  let Y = date.getFullYear() + '-',
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
    D = date.getDate() + ' ',
    h = date.getHours() + ':',
    m = date.getMinutes() + ':',
    s = date.getSeconds()
  return Y + M + D + h + m + s
}

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '换得(YYDY)',
    dataIndex: 'amountGet',
  },
  {
    title: '花费(ETH)',
    dataIndex: 'amountGive',
  },
  {
    title: '创建者',
    dataIndex: 'user',
  }, {
    title: '状态',
    dataIndex: 'orderStatus',
    render: (text, record) => {
      if (record.orderStatus == 1) {
        return "待交易"
      } else if (record.orderStatus == 2) {
        return "已取消"
      } else if (record.orderStatus == 3) {
        return "已完成"
      }
    }
  }, {
    title: '更新时间',
    dataIndex: 'timeStemp',
    render: (text, record) => {
      return getTime(record.timeStemp)
    }
  },

  {
    title: '操作',
    key: 'action',
    render: (_, record) => {
      let myAccount = window.webObj?.account

      if (myAccount == record.user && record.orderStatus == 1) {
        return <Tag color="red" onClick={() => cancelOrder(record)}>取消</Tag>
      }
      if (myAccount != record.user && record.orderStatus == 1) {
        return <Tag color="cyan" onClick={() => finishOrder(record)}>交易</Tag>
      }
    },
  },
]
const cancelOrder =(row)=>{
  let webObj = window.webObj
  webObj.EXCHANGEToken.methods.cancelOrder(
    row.id
  ).send({
    from: webObj.account,
    gas: '1000000'
  }) 
}
const finishOrder =(row)=>{
  let webObj = window.webObj
  webObj.EXCHANGEToken.methods.finishOrder(
    row.id
  ).send({
    from: webObj.account,
    gas: '1000000'
  }) 
}
const App = () => {
  const { orderList } = useSelector(state => state.order)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const showModal = (e) => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onFinish = (values) => {
    const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000'

    let webObj = window.webObj
    const toWei = (number) => {
      return webObj.web3.utils.toWei(number.toString(), 'ether')
    }
    webObj.EXCHANGEToken.methods.makerOrder(
      webObj.YYDYToken._address,
      toWei(values.amountGet),
      ETHER_ADDRESS,
      toWei(values.amountGive)
    ).send({
      from: webObj.account,
      gas: '1000000'
    }) 
    handleCancel()
  }



  return (
    <div>
      <Button type='primary' onClick={showModal}>新增</Button>
      <Table columns={columns} dataSource={orderList} pagination={false} rowKey="id" />

      <Modal title="新增交易" open={isModalOpen} onCancel={handleCancel} >
        <Form autoComplete="off" form={form} onFinish={onFinish}>
          <p>用</p>
          <Form.Item label="ETH" name="amountGive" >
            <Input />
          </Form.Item>
          <p>个ETH，换取</p>

          <Form.Item label="YYDY" name="amountGet" >
            <Input />
          </Form.Item>

          <p>个YYDY</p>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>



        </Form>
      </Modal>
    </div>
  )

}
export default App
