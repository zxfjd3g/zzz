import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button, Table, Icon, Modal, Input, Form, Select, message} from 'antd'
import {
  reqProducts,
  reqAddOrUpdateProduct,
  reqUpOrDownProduct,
  reqProductDetail,
  reqSearchProducts,
  reqCategorys
} from '../../api'

const Option = Select.Option

export default class Product extends Component {

  state = {
    products: [],
    currentIndex: 0,
    total: 0,
    searchType: 'productId',
    searchWord: '',
    status: 0, // 0: 不显示对话框, 1: 显示添加框, 2: 显示更新框, 3: 显示详情框
  }

  getProducts = async (index) => {

    const {currentIndex, searchType, searchWord} = this.state
    this.setState({
      currentIndex: index
    })
    let result
    if (searchWord) {
      result = await reqSearchProducts({pageNum: index, pageSize: 20, searchType, searchWord})
    } else {
      result = await reqProducts(index, 20)
    }

    if (result.status === 0) {
      const {list, total} = result.data
      this.setState({
        products: list,
        total: total
      })
      message.success('获取列表成功!')
    } else {
      message.error('获取失败: ' + result.msg)
    }
  }

  showDetail = (product) => {
    this.product = product
    this.setState({
      status: 3
    })
  }

  showUpdate = (product) => {
    this.product = product
    this.setState({
      status: 2
    })
  }

  showAdd = () => {
    this.setState({
      status: 1
    })
  }

  downOrUpProduct = async (product) => {
    const id = product.id
    const status = product.status === 1 ? 2 : 1
    const result = await reqUpOrDownProduct(id, status)
    if (result.status === 0) {
      product.status = status
      this.setState({
        products: this.state.products
      })
      message.success(result.data)
    } else {
      message.error('操作失败: ' + result.msg)
    }
  }

  search = () => {
    const searchWord = this.state.searchWord.trim()
    if (searchWord) {
      this.getProducts(1)
    }
  }

  /*
  添加商品
   */
  addProduct = () => {

  }

  /*

   */

  componentWillMount() {
    this.columns = [
      {
        title: '商品ID',
        width: 80,
        dataIndex: 'id'
      },
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'subtitle'
      },
      {
        title: '价格',
        key: 'operation1',
        width: 150,
        render: (product) => {
          console.log('render', product)
          const {status} = product
          let statusText = '在售'
          let opText = '下架'
          if (status !== 1) {
            statusText = '已下架'
            opText = '上架'
          }
          return (
            <span>
              <span>{statusText}</span>&nbsp;&nbsp;
              <Button type='primary' onClick={() => this.downOrUpProduct(product)}>{opText}</Button>
            </span>
          )
        }
      },
      {
        title: '操作',
        key: 'operation2',
        width: 100,
        render: (product) => {
          return (
            <span>
              <a href="javascript:;" onClick={() => this.showDetail(product)}>详情</a>&nbsp;&nbsp;
              <a href="javascript:;" onClick={() => this.showUpdate(product)}>修改</a>
            </span>
          )
        }
      },
    ]
    this.modalTitles = ['添加商品', '更新商品', '商品详情']
  }

  componentDidMount() {
    this.getProducts(1)
  }

  render() {
    const {products, total, searchType, searchWord, status} = this.state

    const header = (
      <div>
        <Select value={searchType} onSelect={val => this.setState({searchType: val})}>
          <Option value='productId'>根据商品ID查询</Option>
          <Option value='productName'>根据商品名称查询</Option>
        </Select>
        &nbsp;&nbsp;
        <Input placeholder='关键字'
               style={{width: 200}}
               value={searchWord}
               onChange={e => this.setState({searchWord: e.target.value})}/>
        &nbsp;&nbsp;
        <Button type='primary' onClick={this.search}>搜索</Button>
        <Button type="primary" onClick={this.showAdd} style={{float: 'right'}}>
          <Icon type="plus"/>添加产品
        </Button>
      </div>
    )

    return (
      <div>
        <Table
          rowKey='id'
          columns={this.columns}
          dataSource={products}
          loading={this.state.products.length === 0}
          bordered
          title={() => header}
          pagination={{
            defaultPageSize: 20,
            total,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />

        <Modal visible={status!==0}
               title={this.modalTitles[status-1]}
               width={1000}
               onCancel={() => {
                 this.setState({status: 0})
                 this.form.resetFields()
                 this.product = null
               }}
               onOk={this.addProduct}
        >
          <ProductForm product={this.product}
                   setForm={form => this.form = form}
                   status={status}
          />
        </Modal>
      </div>
    )
  }
}


class ProductForm extends Component {

  static propTypes = {
    product: PropTypes.object,
    setForm: PropTypes.func.isRequired,
    status: PropTypes.number.isRequired,
  }

  state = {
    categorys: [],
    subCategorys: [],
    parentId: -1,
  }

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if(result.status === 0) {
      const categorys = result.data
      if(parentId===0) {
        this.setState({
          parentId,
          categorys,
          subCategorys: []
        })
      } else {
        this.setState({
          parentId,
          subCategorys: categorys
        })
      }
    }
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  async componentDidMount () {
    this.getCategorys(0)
  }

  render() {
    const {categorys, subCategorys, parentId} = this.state
    const {product, status} = this.props

    const {getFieldDecorator} = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    }



    return (
      <Form>
        <Form.Item label='商品名称' {...formItemLayout}>
          {
            getFieldDecorator('name', {
              defaultValue: product.name
            })(
              <Input placeholder='请输入商品名称'/>
            )
          }
        </Form.Item>

        <Form.Item label='商品描述' {...formItemLayout}>
          {
            getFieldDecorator('subtitle', {
              defaultValue: product.name
            })(
              <Input placeholder='请输入商品描述'/>
            )
          }
        </Form.Item>

        <Form.Item label='所属分类' {...formItemLayout}>
          {
            getFieldDecorator('categoryId', {
              defaultValue: product.categoryId
            })(
              <Select >

              </Select>
            )
          }
        </Form.Item>

      </Form>
    )
  }
}

ProductForm = Form.create({})(ProductForm)