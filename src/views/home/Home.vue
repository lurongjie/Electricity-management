<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/img/home/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体内容区域 -->
    <el-container>
      <!-- aside区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu unique-opened :collapse-transition="false" :collapse="isCollapse" router :default-active="isActivePath"
          background-color="#333744" text-color="#fff" active-text-color="#409EFF">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]">
                <!-- 文本 -->
              </i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id"
              @click="navActivePath('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu">
                  <!-- 文本 -->
                </i>{{subItem.authName}}</template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 右侧页面主体内容区域 -->
        <el-main>
          <router-view />
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
  export default {
    name: 'Home',
    data() {
      return {
        menuList: [],
        isCollapse: false,
        isActivePath: null,
        iconObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'
        },
      }
    },
    created() {
      this.getMenuList();
      this.isActivePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      async getMenuList() {
        const {
          data: res
        } = await this.$http.get('/menus')
        if (res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
      },
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      navActivePath(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
      }
    },
  }
</script>
<style lang="less" scoped>
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;

    >div {
      display: flex;
      align-items: center;

      img {
        height: 100%;
      }

      span {
        margin-left: 15px;
        font-size: 20px;
        color: #fff;
      }
    }
  }

  .el-aside {
    background-color: #333744;

  }

  .el-main {
    background-color: #EAEDF1;
  }

  .home-container {
    height: 100%;
  }

  .iconfont {
    margin-right: 10px;
  }

  .el-menu {
    border-right: 0;
  }

  .toggle-button {
    color: #fff;
    font-size: 16px;
    letter-spacing: 0.2em;
    text-align: center;
    line-height: 24px;
    background-color: #ccc;
    cursor: pointer;
  }
</style>