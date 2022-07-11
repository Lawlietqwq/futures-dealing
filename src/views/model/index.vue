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
      :data="list"
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
            <el-descriptions-item v-for="(value, name) in props.row.params1" :label="'开仓策略——'+value.remark" :key="name" :label-style="{'text-align':'center','background':'#E1F3D8'}">
              {{value.value}}
            </el-descriptions-item>
            <el-descriptions-item v-for="(value, name) in props.row.params2" :label="'平仓策略——'+value.remark" :key="name" :label-style="{'text-align':'center','background':'#FDE2E2'}">
              {{value.value}}
            </el-descriptions-item>
            
          </el-descriptions>
        </template>
      </el-table-column>

      <el-table-column label="序号" type="index" align="center" width="80">
      </el-table-column>
      <el-table-column label="实例id" prop="instance_id" width="0px">
        <template v-slot="{row}">
          <span>{{ row.instance_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合约" prop="code" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开仓策略" prop="strategy_sname1" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.strategy_sname1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平仓策略" prop="strategy_sname2" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.strategy_sname2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置时间" prop="create_time" width="300px" align="center">
        <template v-slot="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="instance_status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="stateMap[row.instance_status]">
            {{ row.instance_status=='started'?"正在运行":"已暂停" }}
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import waves from '@/directive/waves' 
import Pagination from '@/components/Pagination'
import { getAllContractCode } from '@/api/contract'
// import * as strategyApi from '@/api/strategy-api'
import * as strategyApi from '@/api/strategy'
import * as modelApi from '@/api/model'
import { copyObj } from '@/utils/util'

export default {
  name: 'ModelPage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      stateMap:{started:"success",created:"info"},
      // modelList: [{code:'TS2209',strategyName:'均线策略',createTime:'2022/7/7',state:1,paramList:[{paramName:'快均线',paramValue:10},{paramName:'慢均线',paramValue:10}]},{code:'T2209',strategyName:'布林线策略',createTime:'2022/7/7',state:0,paramList:[{paramName:'上轨',paramValue:30},{paramName:'中轨',paramValue:20},{paramName:'下轨',paramValue:10}]}],
      modelList:[], 
      codeList: [],
      list: [],
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
    // axios.get('https://csubigdata.com/fut_trading_api/', {
    //   params: {
    //     qtype:'search_strategy_template',
    //     uid: 10
    //   }
    // }).then(res =>{
    //   console.log(res)
    // })
    this.getModelList()
    // this.getContractCode()
  },
  methods: {
    getModelList() {
      this.listLoading = true
      modelApi.getAllModel().then(res => {
        if(res.data){
          this.modelList = res.data
          for (var model of this.modelList){
            model.params1 = eval("("+model.params1+")")
            model.params2 = eval("("+model.params2+")")
          }
          this.total = this.modelList.length
          this.getList()
        }
        this.listLoading = false
      })
    },
    getContractCode(){
      getAllContractCode().then(res => {
        this.codeList = res.data
      })

    },
    modelStart(row){
      strategyApi.startModel(row.instance_id).then(() => {
        row.instance_status = 'started'
        this.tableKey++
      })     
    },
    handleFilter() {
      if(this.listQuery.modelName != ''){
        this.querySearch()
        this.listQuery.page = 1
        this.total = this.modelList.length
        this.getList()
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

    //前端分页
    getList() {
      let list, start, end, isFirst, isLast
      isFirst = this.total < this.listQuery.limit
      isLast = Math.ceil(this.total / this.listQuery.limit) === this.listQuery.page
      start = (this.listQuery.page - 1) * this.listQuery.limit
      end = isFirst || isLast ? start + (this.total % this.listQuery.limit) : start + this.listQuery.limit
      list = copyObj(this.modelList).slice(start, end)
      list.forEach((item, index) => {
        item.seq = index + start
      })
      this.list = list
      this.tableKey++
      return list
    }
  }
}
</script>


<style lang="scss" scoped>
  .opsButton{
    margin-left: 10px;
  }
</style>
