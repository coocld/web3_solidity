import React from 'react'
import { useSelector } from 'react-redux'
import { Card, Col, Row, Statistic } from 'antd'
export default function Balance() {
  const { EtherExchange, EtherWallet, TokenExchange, TokenWallet } = useSelector(state => state.balance)

  return (
    <div> 
      <Row gutter={24}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="交易所余额"
              value={EtherExchange}
              precision={2}
              valueStyle={{ color: '#3f8600' }} 
              suffix="ETH"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="交易所余额"
              value={TokenExchange}
              precision={2}
              valueStyle={{ color: '#cf1322' }} 
              suffix="YYDY"
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="钱包余额"
              value={EtherWallet}
              precision={2}
              valueStyle={{ color: '#3f8600' }} 
              suffix="ETH"
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="钱包余额"
              value={TokenWallet}
              precision={2}
              valueStyle={{ color: '#cf1322' }} 
              suffix="YYDY"
            />
          </Card>
        </Col>
      </Row>

     

    </div>
  )
}
