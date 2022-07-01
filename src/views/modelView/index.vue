<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.projectName" placeholder="模型名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" type="index" align="center" width="80">
      </el-table-column>
      <el-table-column label="模型编号" prop="pid" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模型名" prop="projectName" width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="caseList(row)">{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合约名" prop="uid" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.uid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="模型描述" prop="comment" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="模型名">
          <el-input v-model="temp.projectName" />
        </el-form-item>
        <el-form-item label="模型描述">
          <el-input v-model="temp.comment" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消 
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import waves from '@/directive/waves' // waves directive
// import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ModelView',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        projectName:'',
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      temp: {
        pid: -1,
        projectName: '',
        uid: this.$store.getters.uid,
        comment: '',
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$store.dispatch('case/select_user_projects').then(res => {
          let {stateCode, data} = res
          data = data.map(value => {
              let {createdTime,updatedTime,tid,...reset}={...value}
                return reset
            })
          if(stateCode==1000){
              this.list = data
              this.total = data.length
          }
          setTimeout(() => {
          this.listLoading = false
          }, 1.5 * 1000)
      })
    },
    handleFilter() {
      if(this.listQuery.projectName != ''){
        this.querySearch()
        this.listQuery.page = 1
        this.total = this.list.length
      }
      else{
          this.getList()
      }
    },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },

    setTemp(pid,projectName,comment){
        this.temp = {
        pid: pid,
        projectName: projectName,
        comment: comment,
      }
    },
    resetTemp() {
      this.temp = {
        pid: -1,
        projectName: '',
        comment: '',
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('case/create_project',{projectName:this.temp.projectName, comment:this.temp.comment}).then(res => {
            if(res.state == 1000){
            const {pid,projectName,comment} = res.data.project
            this.setTemp(pid, projectName, comment)
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            }
            else return false
          })
        }
      })
    },
    handleUpdate(row) {
      this.setTemp(row.pid, row.projectName, row.comment)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let projectInfo = {
              pid:this.temp.pid,
              tid:0,
              projectName:this.temp.projectName,
              comment:this.temp.comment,
              }
              console.log(projectInfo)
          this.$store.dispatch('case/update_project',projectInfo).then(stateCode => {
            console.log(stateCode)
            if(stateCode==1000){
            const index = this.list.findIndex(v => v.pid === this.temp.pid)
            console.log(index)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            }
            else return false 
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$store.dispatch('case/delete_project',[row.pid]).then(stateCode =>{
      if(stateCode==1000){
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
      }
      })
    },
    // getSortClass: function(key) {
    //   const sort = this.listQuery.sort
    //   return sort === `+${key}` ? 'ascending' : 'descending'
    // },
    
    querySearch() {
      var searchData = []
      var vm = this
      this.list.forEach(function (item) {
        if (item.projectName.toLowerCase().indexOf(vm.listQuery.projectName.toLowerCase()) > -1) {
          searchData.push(item);
        }
      });
      this.list = searchData;
    },
    caseList(row){
        this.$router.push({name:'caseView',params:{pid:row.pid}})
    },
  }
}
</script>
