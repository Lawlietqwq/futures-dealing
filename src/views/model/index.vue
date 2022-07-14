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
            <el-descriptions-item v-for="param in props.row.openParams" :label="'开仓策略——'+param.paramName" :key="param.paramId" :label-style="{'text-align':'center','background':'#E1F3D8'}">
              {{param.paramValue}}
            </el-descriptions-item>
            <el-descriptions-item v-for="param in props.row.closeParams" :label="'平仓策略——'+param.paramName" :key="param.paramId" :label-style="{'text-align':'center','background':'#FDE2E2'}">
              {{param.paramValue}}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>

      <el-table-column label="序号" type="index" align="center" width="80">
      </el-table-column>
      <el-table-column v-if="false" label="实例id" prop="modelId" width="0px">
        <template v-slot="{row}">
          <span>{{ row.modelId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合约" prop="code" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开仓策略" prop="openName" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.openName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平仓策略" prop="closeName" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.closeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置时间" prop="createTime" width="300px" align="center">
        <template v-slot="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="modelState" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="stateMap[row.modelState]">
            {{ stateNameMap[row.modelState] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{row}" style="display: flex;justify-content: space-around;">
          <el-button type="success" class="opsButton" @click="modelStart(row)">启动</el-button>
          <el-button type="info" class="opsButton" @click="modelStop(row)">暂停</el-button>
          <el-button type="warning" class="opsButton" @click="modelClose(row)">平仓</el-button>
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
      stateMap:{started:"",created:"info",holding:"warning",closing:"danger",closed:"success"},
      stateNameMap:{started:"正在运行",created:"已暂停",holding:"已持仓",closing:"正在平仓",closed:"交易成功"},
      tradingVO:{
        modelId: null,
        account: this.$store.getters.account,
        tradingAccount: this.$store.getters.tradingAccount,
      },
      modelList:[], 
      list: [],
      timeStamp: 1,
      listQuery: {
        page: 1,
        limit: 20,
        code:'',
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      tmp: 0,

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
    
  },
  methods: {
    getModelList() {
      this.listLoading = true
      modelApi.getAllModel().then(res => {
        if(res.data){
          console.log(this.modelList)
          this.modelList = res.data
          // for (var model of this.modelList){
          //   model.params1 = eval("("+model.params1+")")
          //   model.params2 = eval("("+model.params2+")")
          // }
          this.total = this.modelList.length
          this.getList()
        }
        this.listLoading = false
      })
    },

    modelStart(row){
      this.tradingVO.modelId = row.modelId
      modelApi.startModel(this.tradingVO).then(() => {
        row.modelState = 'started'
        this.tableKey++
      })     
    },
    modelStop(row){
      modelApi.pauseModel({modelId:row.modelId, modelState:row.modelState}).then(() =>
       {
        row.modelState = 'created'
        this.tableKey++
      })     
    },
    modelClose(row){
      this.tradingVO.modelId = row.modelId
      var tmpState = row.modelState
      row.modelState = 'closing'
      this.tableKey++
      modelApi.forceCloseModel(this.tradingVO).then(() => {
        row.modelState = 'closed'
        this.tableKey++
      }).catch(err =>
        row.modelState = tmpState
      )
    },
    modelDel(row){
      modelApi.deleteModel(row.modelId).then(() => {
        this.tableKey++
      })     
    },
    handleFilter() {
      if(this.listQuery.code != ''){
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
        if (item.code.toLowerCase().indexOf(vm.listQuery.code.toLowerCase()) > -1) {
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
      console.log(this.listQuery)
      console.log(this.listQuery.limit)
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
