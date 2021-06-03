<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ordersList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" size="mini" v-if="scope.row.pay_status">未付款</el-tag>
            <el-tag type="success" size="mini" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditAddressForm"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="showProgress(scope.row.order_id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.page_num" :page-sizes="[8, 10, 12, 14]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 编辑地址对话框 -->
    <el-dialog title="编辑地址"" :visible.sync=" addressDialogVisible" width="50%" @close="editAddressFormClose">
      <el-form :model="editAddressForm" ref="editAddressFormRef" :rules="addressFormRules" label-width="100px">
        <el-form-item label="活动名称" prop="address1">
          <el-cascader v-model="editAddressForm.address1" :options="cityData" :props="{ expandTrigger: 'hover' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑地址对话框  接口存在漏洞，后台崩-->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
    </el-dialog>
  </div>
</template>
<script>
  import cityData from './citydata.js'
  export default {
    name: 'Orders',
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        ordersList: [],
        total: 0,
        addressDialogVisible: false,
        editAddressForm: {
          address1: [],
          address2: ''
        },
        cityData,
        addressFormRules: {
          address1: [{
            required: true,
            message: '请选择省市区县',
            trigger: 'blur'
          }],
          address2: [{
            required: true,
            message: '请输入详细地址',
            trigger: 'blur'
          }],
        },
        progressVisible: false,
      }
    },
    created() {
      this.getOrdersList()
    },
    methods: {
      async getOrdersList() {
        const {
          data: res
        } = await this.$http.get(`orders`, {
          params: this.queryInfo

        })
        if (res.meta.status !== 200) return this.$message.error('获取订单数据失败')
        this.ordersList = res.data.goods
        this.total = res.data.total
        console.log(this.total);

      },
      handleSizeChange(newsize) {
        this.queryInfo.pagesize = newsize
        this.getOrdersList()
      },
      handleCurrentChange(newpage) {
        this.queryInfo.pagenum = newpage
        this.getOrdersList()
      },
      showEditAddressForm() {
        this.addressDialogVisible = true
      },
      editAddressFormClose() {
        this.editAddressForm.address1 = []
        this.$refs.editAddressFormRef.resetFields()
      },
      async showProgress(order_id) {
        const {
          data: res
        } = await this.$http.get(`/kuaidi/1106975712662`)
        console.log(res)
      }
    },
  }
</script>
<style lang="less" scoped>

</style>