<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.code" placeholder="合约号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="modelList"
      row-key="code"
      ref="modelTable"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-descriptions :column="1" :label-style="{'text-align':'center'}" border>
            <el-descriptions-item v-for="param in props.row.paramList" :label="param.paramName" :key="param.paramName" :label-style="{'text-align':'center','background':'#E1F3D8'}">
              {{param.paramValue}}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>

      <el-table-column label="序号" type="index" align="center" width="80">
      </el-table-column>
      <el-table-column label="合约" prop="code" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="策略" prop="strategyName" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.strategyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置时间" prop="create_time" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="instance_status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="stateMap[row.state]">
            {{ row.state==1?"正在运行":"已暂停" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{row}" style="display: flex;justify-content: space-around;">
          <el-button type="success" class="opsButton" @click="modelStart(row)">启动</el-button>
          <el-button type="info" class="opsButton" @click="modelStop(row)">暂停</el-button>
          <el-button type="warning" class="opsButton" @click="modelCover(row)">平仓</el-button>
          <el-button type="danger" class="opsButton" @click="modelDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getModelList" />

  </div>
</template>

<script>
import waves from '@/directive/waves' 
import Pagination from '@/components/Pagination'
import { getAllContractCode } from '@/api/contract'
import * as strategyApi from '@/api/strategy-api'
import { copyObj } from '@/utils/util'

export default {
  name: 'ModelPage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      multipleSelection: [],
      stateMap:["info","success"],
      // modelList: [{code:'TS2209',strategyName:'均线策略',createTime:'2022/7/7',state:1,paramList:[{paramName:'快均线',paramValue:10},{paramName:'慢均线',paramValue:10}]},{code:'T2209',strategyName:'布林线策略',createTime:'2022/7/7',state:0,paramList:[{paramName:'上轨',paramValue:30},{paramName:'中轨',paramValue:20},{paramName:'下轨',paramValue:10}]}],
      modelList:[],
      codeList: [],
      timeStamp: 1,
      listQuery: {
        page: 1,
        limit: 20,
        modelName:'',
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      tmp: 0,
      tmpData: {
        modelId: null,
        code: '',
        uid: this.$store.getters.uid,
        modelName: '',
        remark: '',
        paramList: [],
      },
      // rules: {
      //   type: [{ required: true, message: 'type is required', trigger: 'change' }],
      //   timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
      //   title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      // },
    }
  },
  // watch:{
  //   modelId:{
  //     deep:true,
  //     handler(){
  //       this.dialogFormVisible = true
  //     }
  //   }
  // },

  created() {
    this.getModelList()
    // this.getContractCode()
  },
  methods: {
    getModelList() {
      this.listLoading = true
      strategyApi.getAllStrategy().then(res => {
        if(res) this.modelList = eval(res)
        this.total = this.modelList.length
        this.listLoading = false
        console.log(modelList,'modelList')
      })
    },
    getContractCode(){
      getAllContractCode().then(res => {
        this.codeList = res.data
      })

    },
    modelStart(){
      

    },
    handleFilter() {
      if(this.listQuery.modelName != ''){
        this.querySearch()
        this.listQuery.page = 1
        this.total = this.modelList.length
      }
      else{
          this.getModelList()
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

    handleCreate() {
      this.dialogFormVisible = true
      
      this.$nextTick(() => this.$refs['contractTable'].clearSelection())
    },

    updateData() {
      this.$refs['createForm'].validate((valid) => {
        if (valid) {
          modelApi.updateModel(this.tmpData).then(res => {
            const index = this.modelList.findIndex(model => model.modelId === this.tmpData.modelId)
            this.modelList.splice(index, 1, this.tmpData)
            this.dialogFormVisible = false
            console.log(this.tmpData,'this')
            this.tableKey += 1
            this.$notify({
              title: '模型更新',
              message: '更新成功',
              type: 'success',
              duration: 1000
            })   
          })
        }
      })
    },
    handleDelete(row, index) {
      var that = this
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          modelApi.deleteModel(row.modelId).then(res =>{
            this.$notify({
              title: '模型删除',
              message: '删除成功',
              type: 'success',
              duration: 1000
           })
          that.modelList.splice(index, 1)
        })
      }).catch(() => {         
        });
    },

    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    
    querySearch() {
      var searchData = []
      var vm = this
      this.modelList.forEach(function (item) {
        if (item.modelName.toLowerCase().indexOf(vm.listQuery.modelName.toLowerCase()) > -1) {
          searchData.push(item);
        }
      });
      this.modelList = searchData;
    },
    showModelDetail(row){
        modelApi.getModelById(row.modelId).then(res => {
          this.detailVisable = true
          this.modelDetal = res.data
        })
    },
    //el-input bug 需要强制刷新
    change(){
       this.$forceUpdate();
    },
  }
}
</script>


<style lang="scss" scoped>
  .opsButton{
    margin-left: 10px;
  }
</style>
