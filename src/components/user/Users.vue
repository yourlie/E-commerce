<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter ='20'>
                <el-col :span="7">
                    <el-input
                        placeholder="请输入内容"
                        clearable
                        @click="getUserList"
                        v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
        <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮件"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                     <!-- 修改 -->
                     <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                     <!-- 删除 -->
                     <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                     <!-- 分配角色 -->
                     <el-tooltip class="item" content="分配角色" effect='dark' placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                     </el-tooltip>
                     </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 3, 4]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close ="addDialogClosed"
        >
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 修改对话框 -->
         <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close ="editDialogClosed"
        >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="editForm.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 分配角色的对话框 -->
                <el-dialog
        title="添加用户"
        :visible.sync="setDialogVisible"
        width="50%"
        @close ="setRoleDialogClosed"
        >
        <div>
            <p>当前的用户：{{userInfo.username}}</p>
            <p>当前的角色：{{userInfo.role_name}}</p>
            <p>
                分配新角色：
                <el-select v-model="selectRoleId" placeholder="请选择">
                    <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                    </el-option>
                </el-select>
            </p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        // 验证邮箱的规则
        var checkEmail = (res,value,cb)=>{
            // 验证邮箱的正则表达式
            const regEmail =  /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/
            if(regEmail.test(value)){
                // 合法的邮箱
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        // 验证手机号的规则
        var checkMobile = (res,value,cb) => {
            // 验证手机号的正则
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if(regMobile.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的手机号'))
        }
        return{
        queryInfo:{
            query:'',
            pagenum:1,              
            pagesize:2
        },
        userlist:[],
        rolesList:[],
        selectRoleId:'',
        total:0,
        dialogVisible: false,
        addForm:{
            username:'',
            password:'',
            email:'',
            mobile:''
        },
        editForm:{},
        // 需要被分配角色的用户信息
        userInfo:{},
        // 所有角色的数据列表 
        rolesList:[],
        // 已选中的角色id值
        selectedRoleId:'',
        addDialogVisible:false,
        editDialogVisible:false,
        setDialogVisible:false,
        addFormRules:{
            username:[
                    { required: true, message:'请输入用户名字', trigger: 'blur' },
                    {min:3,max:10,message:'用户名的长度在3~10之间', trigger: 'blur'}
                ],
            password:[
                { required: true, message:'请输入密码', trigger: 'blur' },
                {min:6,max:10,message:'用户名的长度在6~10之间', trigger: 'blur'}
            ],
            email:[
                { required: true, message:'请输入邮箱', trigger: 'blur' },
                {validator:checkEmail,trigger:'blur'}
            ],
            mobile:[
                { required: true, message:'请输入用户手机号', trigger: 'blur' },
                {validator:checkMobile,trigger:'blur'}
            ]
            },
        editFormRules:{
            email:[
                 { required: true, message:'请输入邮箱', trigger: 'blur' },
                 {
                    validator:checkEmail,
                    message:'邮箱格式不正确，请重新输入',
                    trigger: 'blur'
                 }
            ],
            mobile:[
                 { required: true, message:'请输入手机号码', trigger: 'blur' },
                 {
                    validator:checkMobile,
                    message:'手机号码格式不正确，请重新输入',
                    trigger: 'blur'
                 }
            ]
        }
        }
    },
    methods:{
        async getUserList(){
            const {data:res} = await this.$http.get('users',{params:this.queryInfo})
            if(res.meta.status != 200){
                return this.$message.error('获取用户列表失败')
            }
            this.userlist = res.data.users
            this.total = res.data.total
        },

        async userStateChanged(userinfo){
            const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)  
            if(res.meta.status != 200){
                userinfo.mg_state =! userinfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        },
        handleSizeChange(newSize){
            // 当pagesize改变时触发 
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        handleCurrentChange(current){
            this.queryInfo.pagenum = current;
            this.getUserList()
        },
        addUser(){
            this.$refs.addFormRef.validate(async valid =>{
                if (!valid) return 
                const {data:res} = await this.$http.post('users', this.addForm)
                if(res.meta.status !==201){
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                this.addDialogVisible = false 
                this.getUserList()
            })
            
        },
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        async showEditDialog(id){
            const {data:res} = await this.$http.put('users/' + id)
            console.log(res)
            if(res.meta.status !== 200) return this.message.error('获取用户信息失败')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        editUserInfo(){
            // 用户点击修改表单中的确定按钮之后，验证表单数据 
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return this.error('请填写完整用户信息')
                const {data:res} = await this.$http.put(
                    'users/' + this.editForm.id,
                    this.editForm
                )
                console.log(res)
                if (res.meta.status !== 200) return this.$message.error('修改用户失败')
                this.$message.success('修改用户成功')
                this.editDialogVisible = false 
                this.getUserList() 
            })
        },
        async removeUserById(id){
            const confirmResult = await this.$confirm('是否要永久删除该用户', '删除提示',{
                confirmButtonText:'确认删除',
                cancelButtonText:'取消',
                type:'warning'
            }).catch(err =>err)
            // 如果用户点击确定，则confirmResult为‘confirm’
            // 如果用户点击取消，则confirmResult获取的就是catch的错误信息‘cancel’
            if (confirmResult !== 'confirm'){
                return this.$message.info('已经取消删除')
            }
            // 发送请求根据id完成删除操作
            const {data:res} = await this.$http.delete('users/' + id)
            // 判断如果删除失败 就做提示
            if (res.meta.status !==200) return this.$message.error('删除用户失败')
            // 修改成功的提示
            this.$message.success('删除用户成功')
            // 重新请求最新的数据
            this.getUserList()
        },
        // 监听分配角色对话框的关闭事件
        setRoleDialogClosed(){
           this.selectedRoleId = ''
           this.userInfo = {}
        },
        async setRole(userInfo){
            this.userInfo = userInfo
            // 在展示对话框之前 获取所有的角色的列表
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status !==200){
                return this.$message.error('获取角色列表失败！')
            }
            this.rolesList = res.data
            this.setDialogVisible = true
        },
        // 点击按钮 分配角色
        async saveRoleInfo(){
            if(this.selectedRoleId){
                return this.$message.error('请选择要分配的角色！')
            }
            const { data: res } = await this.$http.put(
            `users/${this.userInfo.id}/role`,
            {
                rid: this.selectedRoleId
            }
            )
            console.log(this.selectedRoleId)
            console.log(res)
            if (res.meta.status !== 200){
                return this.$message.error('更新角色失败！')
            }
            this.$message.success('更新角色成功')
            this.getUserList()
            this.setDialogVisible = false
        }


    },
    created(){
        this.getUserList()
    }
}
</script>


<style lang="less" scoped>

</style>