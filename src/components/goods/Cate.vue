<template>
    <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

        <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" 
      :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="colorL:lightgreen;"></i>
            <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0 ">一级</el-tag>       
            <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querInfo.pagenum"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="querInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

      </el-card>
    </div>
</template>


<script>
export default {
    data(){
        return{
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelist:[],
      total:0,
      columns:[        
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label:'是否有效',
          type:'template',
          template:'isok'
        },
        {
          label:'排序',
          type:'template',
          template:'order'
        },
        {
          label:'操作',
          type:'template',
          template:'opt'
        }
        ],
        addCateDialogVisible: false,
                // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 父级分类的列表
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的Id数组
      selectedKeys: []
      }
    },
    created(){
      this.getCateList()
    },
    methods:{
      async getCateList(){
        const {data:res} = await this.$http.get(
          'categories',{paramms:this.querInfo}
        )

        if (res.meta.status !== 200){
          return this.$message.error('获取商品分类失败！')
        }
        this.catelist = res.data.result
        this.total = res.data.total 
      },
      showAddCateDialog(){
        this.getParentCateList()
        this.addCateDialogVisible = true 
      },
      // 监听pagesize改变
      handleSizeChange(){
        this.querInfo.pagenum = newPage
        this.getCateList()
      },
      // 监听pagenum改变
      handleCurrentChange(){
        this.querInfo.pagenum = newPage
        this.getCateList()
      },
      // 获取父级分类的数据列表
      async getParentCateList(){
        const {data:res} = await this.$http.get('categories',{
          paramms:{type:2}
        })

        if (res.meta.stutus !==200){
          return this.$message.error('获取父级分类数据失败！')
        }
        this.parentCateList = res.data 
      }
    }
}
</script>

<style lang="less" scoped>
    
</style>