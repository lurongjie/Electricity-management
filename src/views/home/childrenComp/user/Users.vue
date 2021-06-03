<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div class="text item">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
              <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="userList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobole" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="showEditDialog(scope.row.id)">
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removeUserById(scope.row.id)">
            </el-button>
            <el-tooltip class="item" effect="dark" content="角色分配" :enterable="false" placement="top"
              @click="roleSet(scope.row)">
              <el-button type="warning" icon="el-icon-setting" size="mini" circle @click="setRole(scope.row)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>
    <!-- 添加用户信息对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
      <el-form ref="addUserFormRef" :model="addUserForm" :rules="addUserFormRules">
        <!--用户名-->
        <el-form-item label="用户名" prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="addUserForm.username"></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item label="密码" prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="editUserForm" ref="editUserFormRef" :rules="editUserFormRules" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClose">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'Users',
    data() {
      // 自定义邮箱规则
      var checkEmail = (rule, value, callback) => {
        const regEmail = /^\w+@\w+(\.\w+)+$/
        if (regEmail.test(value)) {
          // 合法邮箱
          return callback()
        }
        callback(new Error('请输入合法邮箱'))
      }
      // 自定义手机号规则
      var checkMobile = (rule, value, callback) => {
        const regMobile = /^1[34578]\d{9}$/
        if (regMobile.test(value)) {
          return callback()
        }
        // 返回一个错误提示
        callback(new Error('请输入合法的手机号码'))
      }
      return {
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 2
        },
        userList: [],
        total: 0,
        //开启添加用户信息对话框
        dialogVisible: false,
        //开启修改用户信息对话框
        editDialogVisible: false,
        //获取修改用户信息
        editUserForm: '',
        addUserForm: {
          username: '',
          password: '',
          email: '',
          mobole: ''
        },
        setRoleDialogVisible: false,
        userInfo: {},
        roleList: '',
        selectedRoleId: '',
        addUserFormRules: {
          username: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 10,
              message: '用户名的长度在2～10个字',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入用户密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 18,
              message: '用户密码的长度在6～18个字',
              trigger: 'blur'
            }
          ],
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        editUserFormRules: {
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入手机号码',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
      }
    },
    created() {
      this.getUserList()
    },
    methods: {
      async getUserList() {
        const {
          data: res
        } = await this.$http.get('users', {
          params: this.queryInfo
        })
        if (res.meta.status != 200) return this.$message.error('获取用户列表失败！')
        this.total = res.data.total
        this.userList = res.data.users
      },
      // 监听 页码值 改变事件
      handleCurrentChange(newNum) {
        this.queryInfo.pagenum = newNum
        this.getUserList()
      },
      // 监听 pagesize改变的事件
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      async userStateChange(userInfo) {
        const {
          data: res
        } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        if (res.meta.status != 200) {
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error('更改用户状态失败！')
        }
        this.$message.success('更改用户状态成功')
      },
      addDialogClosed() {
        this.$refs.addUserFormRef.resetFields()
      },
      addUser() {
        this.$refs.addUserFormRef.validate(async valid => {
          if (!valid) return
          const {
            data: res
          } = await this.$http.post('users', this.addUserForm)
          console.log(res);

          if (res.meta.status != 201) {
            return this.$message.error('添加用户失败！')
          }
          this.getUserList()
          this.dialogVisible = false
          this.$message.success('添加用户成功！')
        })
      },
      async showEditDialog(id) {
        const {
          data: res
        } = await this.$http.get('users/' + id)
        if (res.meta.status != 200) {
          return this.$message.error('查询用户信息失败！')
        }
        this.editUserForm = res.data
        console.log(this.editUserForm);
        this.editDialogVisible = true
      },
      editDialogClosed() {
        this.$refs.editUserFormRef.resetFields()
      },
      editUserInfo() {
        this.$refs.editUserFormRef.validate(async validate => {
          if (!validate) return
          const {
            data: res
          } = await this.$http.put('users/' + this.editUserForm.id, {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          })
          this.editDialogVisible = false
          if (res.meta.status != 200) {
            return this.$message.error('更新用户信息失败!')
          }
          this.getUserList()
          return this.$message.success('更新用户信息成功！')
        })
      },
      async removeUserById(id) {
        const confirmResault = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResault !== 'confirm') {
          return this.$message.info('已取消删除！')
        }
        const {
          data: res
        } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败！')
        }
        this.$message.success('删除成功！')
        this.getUserList()
      },
      async setRole(userInfo) {
        this.userInfo = userInfo
        const {
          data: res
        } = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户信息失败')
        }
        this.roleList = res.data
        this.setRoleDialogVisible = true
      },
      async saveRoleInfo() {
        if (!this.selectedRoleId) {
          return this.$message.error('请选择要分配的角色！')
        }
        const {
          data: res
        } = await this.$http.put(`users/${this.userInfo.id}/role`, {
          rid: this.selectedRoleId
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更改角色权限失败！')
        }
        this.getUserList()
        this.setRoleDialogVisible = false
        return this.$message.success('更改角色权限成功！')
      },
      setRoleDialogClose() {
        this.userInfo = ''
        this.selectedRoleId = ''
      }
    },
  }
</script>
<style lang="less" scoped>

</style>