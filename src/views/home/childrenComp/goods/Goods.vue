<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUser">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="110px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80px"></el-table-column>
        <el-table-column label="商品数量" prop="goods_number" width="80px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">{{scope.row.add_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.goods_id)">
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deletGoods(scope.row.goods_id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
    <el-dialog title="收货地址" :visible.sync="editDialogFormVisible" @close="editFormClose">
      <el-form :model="editForm" ref="editFormRef">
        <el-form-item label="商品名称">
          <el-input v-model="editForm.goods_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="editForm.goods_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="editForm.goods_number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="重量">
          <el-input v-model="editForm.goods_weight" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'Goods',
    data() {
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0,
        editDialogFormVisible: false,
        editForm: {}
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      async getGoodsList() {
        const {
          data: res
        } = await this.$http.get('goods', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品列表失败！')
        }
        this.goodsList = res.data.goods
        this.total = res.data.total
      },
      handleSizeChange(newsize) {
        this.queryInfo.pagesize = newsize
        this.getGoodsList()
      },
      handleCurrentChange(newpage) {
        this.queryInfo.pagenum = newpage
        this.getGoodsList()
      },
      async deletGoods(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        const {
          data: res
        } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除商品失败！')
        }
        this.$message.success('删除商品成功！')
        this.getGoodsList()
      },
      async showEditDialog(id) {
        this.editDialogFormVisible = true
        const {
          data: res
        } = await this.$http.get(`goods/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品数据失败！')
        }
        this.editForm = res.data
      },
      editFormClose() {
        this.$refs.editFormRef.resetFields()
      },
      editParams() {
        this.$refs.editFormRef.validate(async validate => {
          console.log(this.editForm);

          if (!validate) return
          const {
            data: res
          } = await this.$http.put(`goods/${this.editForm.goods_id}`, {
            goods_name: this.editForm.goods_name,
            goods_price: this.editForm.goods_price,
            goods_number: this.editForm.goods_number,
            goods_weight: this.editForm.goods_weight,

          })
          console.log(res);

          if (res.meta.status !== 201) {
            return this.$message.error('修改商品数据失败！')
          }
          this.$message.success('修改商品数据成功！')
          this.getGoodsList()
          this.editDialogFormVisible = false
        })
      },
      addUser() {
        this.$router.push('goods/add')
      }
    }
  }
</script>
<style lang="less" scoped>

</style>