<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert class="cat_opt" title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader v-model="selectCateKeys" expandTrigger="hover" :options="cateList" :props="cateProps"
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">动态参数</el-button>
          <!-- 动态表格 -->
          <el-table :data="manyTabsData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag type="primary" v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                  @close="handleClose(index,scope.row)">{{item}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type=" index" label="#">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column prop="name" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">静态属性</el-button>
          <!-- 静态表格 -->
          <el-table :data="onlyTabsData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag type="primary" v-for="(item, index) in scope.row.attr_vals" :key="index" closable
                  @close="handleClose(index,scope.row)">{{item}}
                </el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column prop="name" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加 -->
    <el-dialog :title="'添加' + getTitleText" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog :title="'修改' + getTitleText" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="getTitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'Params',
    data() {
      return {
        cateList: [],
        selectCateKeys: [],
        cateProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        activeName: 'many',
        manyTabsData: [],
        onlyTabsData: [],
        addDialogVisible: false,
        addForm: {},
        addFormRules: {
          attr_name: [{
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }]
        },
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          attr_name: [{
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }]
        },
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {
          data: res
        } = await this.$http.get('categories')
        if (res.meta.status !== 200) {
          return this.$message.error('获取数据失败！')
        }
        this.cateList = res.data
      },
      handleChange() {
        if (this.selectCateKeys.length !== 3) {
          return this.selectCateKeys = []
          this.manyTabsData = []
          this.onlyTabsData = []
        }
        this.getParamData()
      },
      handleClick() {
        this.getParamData()
      },
      async getParamData() {
        const {
          data: res
        } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: this.activeName
          }
        })
        console.log(res.data);

        if (res.meta.status !== 200) {
          return this.$message.error('获取分类参数列表失败！')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTabsData = res.data
        } else {
          this.onlyTabsData = res.data
        }
        return this.$message.success('获取分类参数列表成功！')
      },
      addFormClose() {
        this.$refs.addFormRef.resetFields()
      },
      async addParams() {
        this.$refs.addFormRef.validate(validate => {
          if (!validate) return
        })
        const {
          data: res
        } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamData()
      },
      async showEditDialog(attr_id) {
        const {
          data: res
        } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
          params: {
            attr_sel: this.activeName
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取分类失败！')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },
      editFormClose() {
        this.$refs.editFormRef.resetFields()
      },
      editParams() {
        this.$refs.editFormRef.validate(async validate => {
          if (!validate) return
          const {
            data: res
          } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          })
          if (res.meta.status !== 200) {
            return this.$message.error('修改参数失败！')
          }
          this.$message.success('修改参数成功！')
          this.getParamData()
          this.editDialogVisible = false
        })
      },
      async deleteParams(attr_id) {
        const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        const {
          data: res
        } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('删除参数失败！')
        }
        this.$message.success('删除参数成功！')
        this.getParamData()
      },
      async handleInputConfirm(row) {
        console.log(row);

        if (row.inputValue.trim().length === 0) {
          row.inputValue = ''
          row.inputVisible = false
          return
        }
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        this.saveAttrVals(row)
      },
      showInput(row) {
        row.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      async saveAttrVals(row) {
        const {
          data: res
        } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数项失败！')
        }
        return this.$message.success('修改参数项成功！')
      },
      handleClose(id, row) {
        row.attr_vals.splice(id, 1)
        this.saveAttrVals(row)
      }

    },
    computed: {
      isBtnDisabled() {
        if (this.selectCateKeys.length !== 3) {
          return true
        }
        return false
      },
      cateId() {
        if (this.selectCateKeys.length === 3) {
          return this.selectCateKeys[this.selectCateKeys.length - 1]
        }
      },
      getTitleText() {
        if (this.activeName === 'many') {
          return '动态参数'
        }
        return '静态属性'
      }
    },
  }
</script>
<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0PX;
  }

  .el-tag {
    margin: 8px;
  }

  .input-new-tag {
    width: 100px;
  }
</style>