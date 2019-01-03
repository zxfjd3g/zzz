import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Button, Table, Icon, Modal, Input, Form, Select, message} from 'antd'
import {reqCategorys, reqUpdateCategory, reqAddCategory} from '../../api'

const Option = Select.Option

export default class Category extends Component {

  state = {
    parentId: 0, // 父级分类的id
    parentName: '', // 父级分类的名称
    categorys: [], // 所有一级分类的数组
    subCategorys: [], // 需要显示的二级分类的数组
    isShowUpdate: false, // 是否显示用于更新分类的对话框
    isShowAdd: false, // 是否显示用于添加的对话框
    category: {}, // 当前分类
  }

  clickAdd = () => {
    this.setState({
      isShowAdd: true
    })
  }

  AddCategory = async () => {
    const {parentId, categoryName} = this.form.getFieldsValue()
    // console.log('data', data)
    this.setState({isShowAdd: false})
    this.form.resetFields()

    const result = await reqAddCategory(parentId, categoryName)
    if (result.status === 0) {
      message.success(result.data)
      if (parentId === this.state.parentId) {
        this.getCategorys()
      }
    } else {
      message.error('添加失败: ' + result.msg)
    }
  }

  /*
  根据当前的parentId得到分类(一级/二级)列表并更新状态
   */
  getCategorys = async () => {
    const parentId = this.state.parentId
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === 0) {
        this.setState({
          categorys
        })
      } else {
        this.setState({
          subCategorys: categorys
        })
      }
    }
  }

  /*
  显示指定分类的子分类列表
   */
  showSubCategorys = async () => {
    const {category} = this.state
    // 更新父分类id和名称
    this.setState({
      parentId: category.id,
      parentName: category.name
    }, () => {
      this.getCategorys()
    })
  }

  clickUpdateCategory = () => {
    this.setState({
      isShowUpdate: true
    })
  }

  handleNameChange = (e) => {
    const category = this.state.category
    category.name = e.target.value
    this.setState({
      category
    })
  }

  updateCategory = async () => {
    const {id, name} = this.state.category
    console.log(id, name, this.state.category)
    this.setState({
      isShowUpdate: false,
    })
    const result = await reqUpdateCategory(id, name)
    if (result.status === 0) {
      this.getCategorys()
    }
  }

  componentWillMount() {
    this.columns = [
      {
        title: '品类ID',
        dataIndex: 'id'
      },
      {
        title: '品类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        key: 'operation',
        width: 200,
        render: () => {
          return (
            <span>
              <a href="javascript:;" onClick={this.clickUpdateCategory}>修改名称</a>&nbsp;&nbsp;
              {
                this.state.parentId === 0
                  ? <a href="javascript:;" onClick={this.showSubCategorys}>查看其子品类</a>
                  : null
              }
            </span>
          )
        }
      },
    ]
  }

  async componentDidMount() {
    this.getCategorys()
  }

  showFirstCategorys = () => {
    this.setState({
      parentId: 0,
      parentName: '',
      subCategorys: [],
      category: {}
    })
  }

  setForm = (form) => {
    this.form = form
  }

  render() {

    const {parentId, parentName, categorys, subCategorys, isShowUpdate, category, isShowAdd} = this.state
    const header = (
      <div>

        {
          parentId === 0 ? (
            <span>一级分类列表</span>
          ) : (
            <span>
              <a href="javascript:" onClick={this.showFirstCategorys}>一级分类</a>
              <Icon type='arrow-right' style={{marginLeft: 10, marginRight: 10}}/>
              {parentName}
            </span>
          )
        }
        <Button type="primary" onClick={this.clickAdd} style={{float: 'right'}}>
          <Icon type="plus"/>添加品类
        </Button>
      </div>
    )

    return (
      <div>
        <Table
          rowKey='id'
          columns={this.columns}
          dataSource={parentId === 0 ? categorys : subCategorys}
          loading={this.state.categorys.length === 0}
          bordered
          title={() => header}
          pagination={{defaultPageSize: 20, showQuickJumper: true, showSizeChanger: true}}
          onRow={(category) => {
            return {
              onClick: () => {
                console.log('------')
              },       // 点击行
              onMouseEnter: () => {
                console.log('-', category)
                this.setState({
                  category: {...category}
                })
              },  // 鼠标移入行
            };
          }}
        />

        <Modal visible={isShowUpdate}
               closable={false}
               mask={false}
               title='更新分类2'
               width={250}
               onCancel={() => this.setState({isShowUpdate: false})}
               onOk={this.updateCategory}
        >
          <Input value={category.name} onChange={this.handleNameChange}/>
        </Modal>

        <Modal visible={isShowAdd}
               title='添加分类'
               onCancel={() => {
                 this.setState({isShowAdd: false})
                 this.form.resetFields()
               }}
               onOk={this.AddCategory}
        >
          <CategoryForm categorys={categorys} setForm={this.setForm}/>
        </Modal>
      </div>
    )
  }
}

class CategoryForm extends Component {

  static propTypes = {
    categorys: PropTypes.array.isRequired,
    setForm: PropTypes.func.isRequired
  }

  componentDidMount() {
    const form = this.props.form
    this.props.setForm(form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {categorys} = this.props
    const options = categorys.map(c => (
      <Option key={c.id} value={c.id}>{c.name}</Option>
    ))
    return (
      <Form>
        <Form.Item label="所属分类">
          {
            getFieldDecorator('parentId', {
              initialValue: 0
            })(
              <Select>
                <Option value={0}>一级分类</Option>
                {options}
              </Select>
            )
          }
        </Form.Item>

        <Form.Item label="分类名称">
          {
            getFieldDecorator('categoryName', {
              initialValue: ''
            })(
              <Input placeholder='输入分类名称'/>
            )
          }
        </Form.Item>
      </Form>
    )
  }
}

CategoryForm = Form.create({})(CategoryForm)