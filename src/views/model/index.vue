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
      row-key="modelId"
      ref="modelTable"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >      
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
      <el-table-column prop="openName" label="开仓策略" width="300rem" align="center">
        <template v-slot="{row}">
          <el-tooltip placement="top">
            <span>{{ row.openName }}</span>
              <div slot="content">
                <div v-for="param in row.openParams" :key="param.paramId">
                    {{param.paramName + ':' + param.paramValue}}
                </div>
              </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="closeName" label="平仓策略" width="300rem" align="center">
        <template v-slot="{row}">
          <el-tooltip placement="top">
            <span>{{ row.closeName }}</span>
            <div slot="content">
                <div v-for="param in row.closeParams" :key="param.paramId">
                    {{param.paramName + ':' + param.paramValue}}
                </div>
              </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="配置时间" prop="createTime" width="300px" align="center">
        <template v-slot="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bkOrSk" label="买卖方向" width="150rem" align="center"> 
        <template v-slot="{row}">
          <span>{{ row.bkOrSk==0?'做多':'做空' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="买卖手数" prop="lot" width="100px" align="center">
        <template v-slot="{row}">
          <span>{{ row.lot }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="modelState" class-name="status-col" width="100px" :key="stateKey">
        <template slot-scope="{row}">
          <el-tag :type="stateMap[row.modelState]">
            {{ stateNameMap[row.modelState] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{row}" class="operation">
          <el-button type="primary" class="opsButton" @click="modelChange(row)">更换平仓策略</el-button>
          <el-button type="success" class="opsButton" @click="modelStart(row)">启动</el-button>
          <el-button type="info" class="opsButton" @click="modelStop(row)">暂停</el-button>
          <el-button type="warning" class="opsButton" @click="modelClose(row)">平仓</el-button>
          <el-button type="danger" class="opsButton" @click="modelDel(row, index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="手动平仓" :visible.sync="dialogFormVisible" @closed="resetTarget">
      <div>
        <h2 align="center" style="margin-bottom:50px">剩余仓位为:&nbsp;<span style="color: red;">{{lot}}手</span></h2>
        <el-form ref="forceForm" :model="tradingVO"  label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="平仓手数">
            <el-input placeholder="请设置手数" v-model="tradingVO.lot"  @input="change()"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消 
        </el-button>
        <el-button type="primary" @click="forceClose">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="更换卖出策略" :visible.sync="changeFormVisible" @closed="resetTarget">
      <div>
        <el-form ref="changeForm" :model="newCloseStrategyVO"  label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="平仓手数">
            <el-input placeholder="请设置手数" v-model="newCloseStrategyVO.lot"  @input="change()"></el-input>
          </el-form-item>
          <!-- 选择平仓策略 -->
          <el-form-item>
              <el-radio v-model="closeDefault" :label="false">仅选择开仓策略</el-radio>
              <el-radio v-model="closeDefault" :label="true">选择平仓策略</el-radio>
          </el-form-item>
          <el-form-item v-show="closeDefault" label="平仓策略">
            <el-select v-model="closeStrategy" value-key="closeName" placeholder="请选择平仓策略">
              <el-option v-for="strategy in closeStrategyList" :key="strategy.closeId+strategy.closeName" :label="strategy.closeName" :value="strategy" ></el-option>
            </el-select>
          </el-form-item>
          <!-- 修改平仓策略参数 -->
          <el-form-item v-show="closeDefault" v-for="param in closeStrategy.closeParams" :key="param.paramName+'buy'" :label="param.paramName">
            <el-input placeholder="请填写参数值" v-model="param.paramValue" @input="change()"></el-input>  
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeFormVisible = false">
          取消 
        </el-button>
        <el-button type="primary" @click="changeComplete">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' 
import Pagination from '@/components/Pagination'
import { getOpenNumByModelId } from '@/api/position'
import * as taskApi from '@/utils/timer'
import * as modelApi from '@/api/model'
import { getAllCloseStrategy } from '@/api/strategy'
import { copyObj } from '@/utils/util'

export default {
  name: 'ModelPage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      total: 0,
      stateKey:0,
      lot:null,
      myTarget:null,
      lotTarget:null,
      listLoading: false,
      dialogFormVisible: false,
      changeFormVisible: false,
      closeDefault: false,
      stateMap:{started:"",created:"info",holding:"warning",closing:"danger",closed:"success"},
      stateNameMap:{started:"正在运行",created:"已暂停",holding:"已持仓",closing:"正在平仓",closed:"交易成功"},
      newCloseStrategyVO:null,
      tradingVO:null,
      row:null,
      closeStrategyList: [],
      modelList:[], 
      list: [],
      rowExpanded:[],
      timeStamp: 1,
      closeStrategy:{
        closeId:null,
        closeName:null,
        closeClass:null,
        closeParams:[]
      },
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


  created() {
    this.getModelList()
    this.getCloseStrategy()
    this.resetTradingVO()
    this.resetNewCloseStrategyVO()
    this.resetTarget()
  },
  beforeDestroy() {
    this.stopTask(this.myTarget)                 
    // this.myTarget = null
  },

  methods: {
    getModelList() {
      this.listLoading = true
      modelApi.getAllModelByUid().then(res => {
        if(res.data){
          this.modelList = res.data
          this.total = this.modelList.length
          this.getList()
          this.tableKey++
        }
        this.listLoading = false
      })
    },

    getCloseStrategy() {
      getAllCloseStrategy().then(res => {
        if(res.data){
          this.closeStrategyList = res.data
        }
      })
    },

    continuedTask(){
      modelApi.getAllModelByUid().then(res => {
        if(res.data){
          this.modelList = res.data
          this.total = this.modelList.length
          this.getList()
          this.stateKey++
          }
        })
    },

    modelChange(row){
      this.stopTask(this.myTarget)
      this.newCloseStrategyVO.modelId = row.modelId
      this.changeFormVisible = true
    },

    changeComplete(){
      var closeName = '空'
      if (this.closeDefault){
        this.newCloseStrategyVO.closeId = this.closeStrategy.closeId
        closeName = this.closeStrategy.closeName
        this.newCloseStrategyVO.closeName = closeName
        this.newCloseStrategyVO.closeClass = this.closeStrategy.closeClass
        this.newCloseStrategyVO.closeParams = this.closeStrategy.closeParams
      } else{
        this.newCloseStrategyVO.closeName = '无'
        this.newCloseStrategyVO.closeClass = 'CloseDefault'
      }
      modelApi.changeCloseModel(this.newCloseStrategyVO).then(res => {
        this.changeFormVisible = false
        this.getModelList()
        this.tableKey++
        this.resetTarget()
        this.$notify({
          title: '修改成功',
          message: `平仓策略修改为${closeName}`,
          type: 'success',
          duration: 1000
        })     
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

    async modelClose(row){
      if(row.closeClass == "CloseDefault"){
        this.$notify({
          title: '无法平仓',
          message: '请设置平仓策略',
          type: 'error',
          duration: 1000
        })
        return
      }
      this.stopTask(this.myTarget)
      this.tradingVO.modelId = row.modelId
      this.row = row
      if(this.row.modelState == "holding"){
        this.lot = (await getOpenNumByModelId(row.modelId)).data
        this.tradingVO.lot = this.lot
        this.dialogFormVisible = true
      }
    },

    forceClose(){
      var tmpState = this.row.modelState
      this.row.modelState = 'closing'
      this.dialogFormVisible = false
      this.tableKey++
      if(this.tradingVO.lot == 0){        
        this.$notify({
          title: '平仓失败',
          message: '无持仓',
          type: 'warning',
          duration: 1000
        })
        this.row.modelState = tmpState
        this.resetTarget() 
        this.tableKey++
        return
      }else if(this.tradingVO.lot > this.lot){
        this.$notify({
          title: '平仓失败',
          message: '超过持仓手数',
          type: 'error',
          duration: 1000
        })
        this.row.modelState = tmpState
        this.resetTarget() 
        this.tableKey++
        return
      }else{
        modelApi.forceCloseModel(this.tradingVO).then(() => {
          this.$notify({
          title: '平仓成功',
          message: `平仓${this.tradingVO.lot}手`,
          type: 'success',
          duration: 1000
        })
        if(this.tradingVO.lot == this.lot){
          this.row.modelState = 'closed'  
        }else{
          this.row.modelState = 'holding'
        }
          this.resetTarget() 
          this.tableKey++
        }).catch(err =>{
          this.dialogFormVisible = false
          this.row.modelState = tmpState
          this.resetTarget() 
          this.tableKey++
        }
        )
      }
    },

    modelDel(row) {
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
            this.modelList.splice(row.seq, 1)
            this.getList()
            this.tableKey++
        })
      })
    },

    handleFilter() {
      if(this.listQuery.code.trim() != ''){
        this.getModelList()
        this.querySearch()
        this.listQuery.page = 1
        this.total = this.modelList.length
        this.getList()
        this.tableKey++
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
      isFirst = this.total < this.listQuery.limit
      isLast = Math.ceil(this.total / this.listQuery.limit) === this.listQuery.page
      start = (this.listQuery.page - 1) * this.listQuery.limit
      end = isFirst || isLast ? start + (this.total % this.listQuery.limit) : start + this.listQuery.limit
      list = copyObj(this.modelList).slice(start, end)
      list.forEach((item, index) => {
        item.seq = index + start
      })
      this.list = list
      return list
    },

    resetTarget(){
      this.myTarget = taskApi.continuedTarget(this.continuedTask, 1000)
    },

    stopTask(target){
      taskApi.stopIntervalTask(target)
      target = null
    },

    resetTradingVO(){
      this.tradingVO = {
          modelId: null,
          uid:this.$store.getters.uid,
          xinyiAccount: this.$store.getters.userInfo.xinyiAccount,
          xinyiPwd: this.$store.getters.userInfo.xinyiPwd,
          tradingAccount: this.$store.getters.userInfo.tradingAccount,
          tradingPwd: this.$store.getters.userInfo.tradingPwd,
          company: this.$store.getters.userInfo.company,
          lot:null
        }
    },

    resetNewCloseStrategyVO(){
      this.newCloseStrategyVO = {
        modelId: null,
        closeId: null,
        closeName: null,
        closeClass: null,
        closeParams: [],
        lot: null
      }
    }
  }
}
</script>


<style lang="scss" scoped>
  .opsButton{
    margin-left: 10px;
  }

</style>
