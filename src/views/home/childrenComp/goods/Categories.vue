<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <tree-table ref="table" :columns="columns" show-index index-text="#" :data="categoriesList"
        :selection-type="false" border :expand-type="false">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="primary" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[3, 5, 7, 9]"
        :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" @close="addCateDialogClose">
      <el-form :model="addCateForm" ref="addCateFormRef" :rules="addCateFormRules" label-width="50%">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKeys" expand-trigger="hover" :options="parentCateList" :props="cascaderProps"
            clearable @change="parentCateChanged">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'Cate',
    data() {
      return {
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        categoriesList: [],
        total: 0,
        addCateDialogVisible: false,
        addCateForm: {
          cat_name: '',
          cat_pid: 0,
          cat_level: 0
        },
        addCateFormRules: {
          cate_name: [{
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }]
        },
        parentCateList: [],
        cascaderProps: {
          checkStrictly: true,
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        selectedKeys: [],
        columns: [{
            label: '分类名称',
            prop: 'cat_name'
          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'sort'
          },
          {
            label: '操作',
            type: 'template',
            template: 'opt'
          },
        ]
      }
    },
    created() {
      this.getCategories()
    },
    methods: {
      async getCategories() {
        const {
          data: res
        } = await this.$http.get('categories', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error('请求数据失败！')
        }
        this.categoriesList = res.data.result
        this.total = res.data.total
      },
      handleSizeChange(newsize) {
        this.queryInfo.pagesize = newsize
        this.getCategories()
      },
      handleCurrentChange(newnum) {
        this.queryInfo.pagenum = newnum
        this.getCategories()
      },
      showAddCateDialog() {
        this.getParentCateList()
        this.addCateDialogVisible = true
      },
      async getParentCateList() {
        const {
          data: res
        } = await this.$http.get('categories', {
          params: {
            type: 2
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取父级分类数据失败！')
        }
        this.parentCateList = res.data
      },
      parentCateChanged() {
        if (this.selectedKeys.length > 0) {
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          this.addCateForm.cat_level = this.selectedKeys.length
          return
        } else {
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
      },
      addCate() {
        this.$refs.addCateFormRef.validate(async validate => {
          if (!validate) return
          const {
            data: res
          } = await this.$http.post('categories', this.addCateForm)
          console.log(res);
          
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败！')
          }
          this.getCategories()
          this.$message.success('添加分类成功！')
          this.addCateDialogVisible = false
        })
      },
      addCateDialogClose() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_pid = ''
        this.addCateForm.cat_level = ''
      }
    },
  }
</script>
<style lang="less" scoped>

</style>