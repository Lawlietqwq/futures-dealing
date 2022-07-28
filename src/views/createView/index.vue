<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.code" placeholder="合约号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      row-key="code"
      ref="contractTable"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        reserve-selection
        type="selection"
        width="55"
        align="center"
        >
      </el-table-column>
      <el-table-column label="合约" prop="code" width="200rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开盘价" prop="open" width="250rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.open }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收盘价" prop="close" width="250rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.close }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最低价" prop="low" width="250rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.low }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最高价" prop="high" width="250rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.high }}</span>
        </template>
      </el-table-column>
      <el-table-column label="持仓" prop="vol" width="250rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.vol }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成交量" prop="amount" width="250rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易日期" prop="tradeDate" width="" align="center">
        <template v-slot="{row}">
          <span>{{ row.tradeDate }}</span>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 添加策略实例 -->
      <el-dialog title="添加策略实例" :visible.sync="dialogFormVisible">
        <div>
          <el-form ref="createForm" :model="tmpData"  label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <!-- 选择开仓策略 -->
            <el-form-item label="开仓策略">
              <el-select v-model="openStrategy" value-key="openName" placeholder="请选择开仓策略">
                <el-option v-for="strategy in openStrategyList" :key="strategy.oepnId+strategy.openName" :label="strategy.openName" :value="strategy" ></el-option>
              </el-select>
            </el-form-item>
            <!-- 修改开仓策略参数 -->
            <el-form-item v-for="param in openStrategy.openParams" :key="param.paramName+'buy'" :label="param.paramName">
              <el-input placeholder="请填写参数值" v-model="param.paramValue" @input="change()"></el-input>  
            </el-form-item>
            <el-divider></el-divider>
            <el-form-item>
              <el-radio v-model="closeDefault" :label="false">仅选择开仓策略</el-radio>
              <el-radio v-model="closeDefault" :label="true">选择平仓策略</el-radio>
            </el-form-item>
            <!-- 选择平仓策略 -->
            <el-form-item v-show="closeDefault" label="平仓策略">
              <el-select v-model="closeStrategy" value-key="closeName" placeholder="请选择平仓策略">
                <el-option v-for="strategy in closeStrategyList" :key="strategy.closeId+strategy.closeName" :label="strategy.closeName" :value="strategy"></el-option>
              </el-select>
            </el-form-item>
            <!-- 修改平仓策略参数参数 -->
            <el-form-item v-show="closeDefault" v-for="param in closeStrategy.closeParams" :key="param.paramName+'sell'" :label="param.paramName">
              <el-input placeholder="请填写参数值" v-model="param.paramValue" @input="change()"></el-input>  
            </el-form-item>
            <el-form-item label="买卖手数">
              <el-input placeholder="请设置手数" v-model="tmpData.lot"  @input="change()"></el-input>
            </el-form-item>
            <!-- 买or卖 -->
            <el-form-item label="合约买卖">
              <el-radio v-model="tmpData.bkOrSk" :label="0">买开卖平</el-radio>
              <el-radio v-model="tmpData.bkOrSk" :label="1">卖开买平</el-radio>
            </el-form-item>
          </el-form>
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消 
        </el-button>
        <el-button type="primary" @click="updateData">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' 
import Pagination from '@/components/Pagination'
import * as contractApi from '@/api/contract'
import * as modelApi from '@/api/model'
import * as strategyApi from '@/api/strategy'
import { copyObj } from '@/utils/util'

export default {
  name: 'CreatePage',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      modelVisible: false,
      multipleSelection: null,
      closeDefault: false,
      openStrategyList: [],
      closeStrategyList: [],
      openStrategy:{
        openId:null,
        openName:null,
        openClass:null,
        openParams:[],
      },

      closeStrategy:{
        closeId:null,
        closeName:null,
        closeClass:null,
        closeParams:[]
      },
      modelList: [],
      list:[],
      timeStamp: 1,
      contractList: [],
      listQuery: {
        page: 1,
        limit: 20,
        code:'',
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      upOrDown: null,
      tmpData: {
        modelId: null,
        code: '',
        uid: this.$store.getters.uid,
        lot: 1, 
        bkOrSk: 0,
      },
      // rules: {
      //   type: [{ required: true, message: 'type is required', trigger: 'change' }],
      //   timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
      //   title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      // },
    }
  },
  // watch:{
  //   upOrDown:{
  //     deep:true,
  //     handler(val){
  //       if(val == 0){
  //         this.tmpData.up_or_down1 = 'up'
  //         this.tmpData.up_or_down2 = 'down'
  //         }
  //       else if(val == 1){
  //         this.tmpData.up_or_down1 = 'down'
  //         this.tmpData.up_or_down2 = 'up'
  //       }   
  //     }
  //   },
  //   'tmpData.strategy_sname1':{
  //     deep:true,
  //     handler(val){
  //       if(val != ''){
  //         strategyApi.getStrategyParam(val).then(res => {
  //           this.tmpData.params1 = res.data
  //           this.$refs['createForm'].$forceUpdate()
  //         })   
  //       }
  //     }
  //   },
  //   'tmpData.strategy_sname2':{
  //     deep:true,
  //     handler(val){
  //       if(val != ''){
  //         strategyApi.getStrategyParam(val).then(res => {
  //           this.tmpData.params2 = res.data
  //           this.$refs['createForm'].$forceUpdate()
  //         })   
  //       }  
  //     }
  //   }
  // },

  created() {
  //   if (this.$store.getters.uid === null){
  //     this.$store.dispatch('user/getInfo').then(res => {
  //       this.tmpData.uid = this.$store.getters.uid
  //   })
  // }
    this.initData()
  },
  methods: {
    initData(){
        this.listLoading = true
        Promise.all(
          [
            strategyApi.getAllOpenStrategy(),
            strategyApi.getAllCloseStrategy(),
            contractApi.getAllContractCode()
            ]
        ).then(res =>{
        let [openData, closeData, contractData] = res.map(res => res.data)
        this.openStrategyList = openData
        this.closeStrategyList = closeData
        this.contractList = contractData.reduce((pre, cur) => 
          { 
            pre.push({ "code":cur }) 
            return pre
          }, [])
        this.total = this.contractList.length
        this.getList()
        this.tableKey++
        this.listLoading = false
        }).catch(err =>
        console.log(err)
        )
    },

    resetCodeList(){
      contractApi.getAllContractCode().then(res => {
        let contractData = res.data
        this.contractList = contractData.reduce((pre, cur) => 
          { 
            pre.push({ "code":cur }) 
            return pre
          }, [])
      })
    },

    getContractList(){
      contractApi.getAllContractCode().then(res => {
        this.contractList = res.data.reduce((pre, cur) => { 
            pre.push({ code:cur })
            return pre
          }, [])
        this.total = this.contractList.length
        this.getList()      
        this.tableKey++
        this.listLoading = false
      })

    },
    handleFilter() {
      if(this.listQuery.code != ''){
        this.resetCodeList()
        this.querySearch()
        this.listQuery.page = 1
        this.total = this.contractList.length
        this.getList()
      }
      else{
          this.getContractList()
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
      if(this.multipleSelection == null){
        this.$notify({
            title: '警告',
            message: '请选择合约',
            type: 'error',
            duration: 1000
            })
      } else{
        this.dialogFormVisible = true
        this.$refs['createForm'].clearSelection()
        // this.$nextTick(() => that.$refs['createForm'].clearSelection())
      }
    },

    updateData() {
      this.$refs['createForm'].validate((valid) => {
        if (valid) {
          if (this.closeDefault){
            this.tmpData = {
              ...this.tmpData,
              ...this.openStrategy,
              ...this.closeStrategy,
            }
          }else{
            this.tmpData = {
              ...this.tmpData,
              ...this.openStrategy,
              closeClass:"CloseDefault",
              closeName:"无",
            }
          }
          let modelVOList = []
          for(var code of this.multipleSelection){
            this.tmpData.code = code.code
            let tmp = {...this.tmpData}
            modelVOList.push(tmp)
          }
            modelApi.createBatchModel(modelVOList).then(res => {                
             this.dialogFormVisible = false
              this.tableKey += 1
              this.multipleSelection = null
              this.resetForm()
              this.$notify({
                title: '提示',
                message: '创建成功',
                type: 'success',
                duration: 1000
              }) 
            })
             
          }
        })
      },


    resetForm(){
      this.openStrategy = {
        openId:null,
        openName:null,
        openClass:null,
        openParams:[],
      },
      this.closeStrategy = {
        closeId:null,
        closeName:null,
        closeClass:null,
        closeParams:[]
      },  
      this.tmpData = {
        modelId: null,
        code: '',
        uid: this.$store.getters.uid,
        lot: 1, 
        bkOrSk: 0,
      }
      this.closeDefault = false
    },

    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    
    querySearch() {
      var searchData = []
      var vm = this
      this.contractList.forEach(function (item) {
        if (item.code.toLowerCase().indexOf(vm.listQuery.code.toLowerCase()) > -1) {
          searchData.push(item);
        }
      });
      this.contractList = searchData;
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
      list = copyObj(this.contractList.slice(start, end))
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
