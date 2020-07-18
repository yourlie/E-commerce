<template>
    <div class="home-container">
         <!--头部区域  -->
        <el-header >
            <div>
                <!-- 黑马logo -->
                <img src="../assets/logo.png" alt="" class="imgstyle">
                <!-- 顶部标题 -->
                <span>电商管理系统后台</span>
            </div>
        <el-button type="info" @click="logout">退出</el-button>  
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse?'64px':'200px'">
                <!-- 伸缩侧边栏按钮 -->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    :unique-opened="true"
                    :collapse="isCollapse"
                    :collapse-transition = 'false'
                    router
                    :default-active="activePath"
                >
                <!-- 一级菜单 -->
                <el-submenu :index ='item.id+""' v-for="item in menuList" :key='item.id'>
                    <template slot="title">
                        <i :class="iconsObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单  -->
                    <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.Id" @click="saveNavState('/'+subItem.path )">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>  
                        </template>
                    </el-menu-item>
                </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 主体结构 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>


<script>
export default {
    data(){
        return{
            // 左边菜单数据 
            menuList:null,
            iconsObj: {
            '125':'iconfont icon-user',
            '103':'iconfont icon-tijikongjian',
            '101':'iconfont icon-shangpin',
            '102':'iconfont icon-danju',
            '145':'iconfont icon-baobiao'
        },
        isCollapse:false,
        // 被激活的链接 
        activePath:''
        }
    },
    created(){
        // 请求左侧菜单数据 
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList(){ 
            // 发送请求获取左侧菜单数据 
            const {data:res} = await this.$http.get('menus')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menuList = res.data
        },
        toggleCollapse(){
            this.isCollapse =! this.isCollapse
        },
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath = activePath
        }
    }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  width: 100%;
//   position: absolute;
}
.el-aside{
  background-color:#333744;
    .el-menu{
    border-right: none;
}
}
.el-main{
  background-color:#eaedf1;
}
.imgstyle{
    height:50px;
    width:50px;
}
.el-header{
    background-color: #373D41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size:20px;
    > div{
        display: flex;
        align-items:center;
        span{
            margin-left:15px;
        }
    }
}
.iconfont{
    margin-left: 10px;
}
.toggle-button{
    background-color: #4A5064;
    font-size:10px;
    line-height: 24px;
    color:#fff;
    text-align: center;
    letter-spacing: 0.2em;

}
</style>
