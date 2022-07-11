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
        width="55">
      </el-table-column>
      <el-table-column label="合约" prop="code" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
    </el-table>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- 添加策略实例 -->
      <el-dialog title="添加策略实例" :visible.sync="dialogFormVisible">
        <div>
          <el-form ref="createForm" :model="tmpData"  label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <!-- 选择买入策略 -->
            <el-form-item label="开仓策略">
              <el-select v-model="tmpData.strategy_sname1" placeholder="请选择开仓策略">
                <el-option v-for="(value,name) in strategyNameList" :key="name+'buy'" :label="value" :value="name" @change="showTable(val)"></el-option>
              </el-select>
            </el-form-item>
            <!-- 修改买入策略参数 -->
            <el-form-item v-for="(value, name) in tmpData.params1" :key="name+'buy'" :label="value.remark">
              <el-input placeholder="请填写参数值" v-model="value.value" @input="change()"></el-input>  
            </el-form-item>
            <el-divider></el-divider>
            <!-- 选择卖出策略 -->
            <el-form-item label="平仓策略">
              <el-select v-model="tmpData.strategy_sname2" placeholder="请选择平仓策略">
                <el-option v-for="(value,name) in strategyNameList" :key="name+'sell'" :label="value" :value="name" @change="showTable(val)"></el-option>
              </el-select>
            </el-form-item>
            <!-- 修改卖出策略参数参数 -->
            <el-form-item v-for="(value, name) in tmpData.params2" :key="name+'sell'" :label="value.remark">
              <el-input placeholder="请填写参数值" v-model="value.value" @input="change()"></el-input>  
            </el-form-item>
            <!-- 买or卖 -->
            <el-form-item label="合约买卖">
              <el-radio v-model="upOrDown" label="0">买开卖平</el-radio>
              <el-radio v-model="upOrDown" label="1">卖开买平</el-radio>
            </el-form-item>
          </el-form>
          <el-table
            :data="modelList"
            style="margin-left: 20px;"
            v-if="modelVisible">
            <el-table-column
              prop="code"
              label="合约"
            >
            </el-table-column>
            <el-table-column
              v-for="param in modelList[0].paramList"
              :key="param.paramValue"
              prop="paramList.paramValue"
              :label="param.paramName"
            >
            </el-table-column>
          </el-table>
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
import { getAllContractCode } from '@/api/contract'
// import * as modelApi from '@/api/model'
import * as strategyApi from '@/api/strategy-api'
import { copyObj } from '@/utils/util'

export default {
  name: 'CreateView',
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
      strategyNameList: [],
      contractList: [],
      modelList: [],
      list:[],
      timeStamp: 1,
      listQuery: {
        page: 1,
        limit: 20,
        code:'',
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      upOrDown: null,
      tmpData: {
        uid: this.$store.getters.uid,
        code: '',
        open_or_close1: 'open',
        up_or_down1: '',
        strategy_sname1: '',
        params1: null,
        open_or_close2: 'close',
        up_or_down2: '',
        strategy_sname2: '',
        params2: null,
      },
      // rules: {
      //   type: [{ required: true, message: 'type is required', trigger: 'change' }],
      //   timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
      //   title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      // },
    }
  },
  watch:{
    upOrDown:{
      deep:true,
      handler(val){
        if(val == 0){
          this.tmpData.up_or_down1 = 'up'
          this.tmpData.up_or_down2 = 'down'
          }
        else if(val == 1){
          this.tmpData.up_or_down1 = 'down'
          this.tmpData.up_or_down2 = 'up'
        }   
      }
    },
    'tmpData.strategy_sname1':{
      deep:true,
      handler(val){
        if(val != ''){
          strategyApi.getStrategyParam(val).then(res => {
            this.tmpData.params1 = res.data
            this.$refs['createForm'].$forceUpdate()
          })   
        }
      }
    },
    'tmpData.strategy_sname2':{
      deep:true,
      handler(val){
        if(val != ''){
          strategyApi.getStrategyParam(val).then(res => {
            this.tmpData.params2 = res.data
            this.$refs['createForm'].$forceUpdate()
          })   
        }  
      }
    }
  },

  created() {
    this.getStrategyList()
    this.getContractList()
    // this.getList()
  },
  methods: {
    getStrategyList() {
      this.listLoading = true
      strategyApi.getStrategyName().then(res => {
        if(res.data) this.strategyNameList = res.data
        this.listLoading = false
      })
    },
    getContractList(){
      this.listLoading = true
      strategyApi.getCodeList().then(res => {
        this.contractList = res.data
        this.total = this.contractList.length
        this.getList()
        this.listLoading = false
      })
    },
    handleFilter() {
      if(this.listQuery.code != ''){
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
      var that = this
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
          for(var code of this.multipleSelection){
            this.tmpData.code = code.code 
            this.tmpData.params1 = JSON.stringify(this.tmpData.params1)
            this.tmpData.params2 = JSON.stringify(this.tmpData.params2)
            strategyApi.createModel(this.tmpData).then(res => {      
            })
          }
          this.dialogFormVisible = false
          this.tableKey += 1
          this.$notify({
            title: '提示',
            message: '创建成功',
            type: 'success',
            duration: 1000
            })
        }
        this.multipleSelection = null
        this.resetForm()
      })
    },


    resetForm(){
      this.tmpData =  {
        uid: this.$store.getters.uid,
        code: '',
        open_or_close1: 'open',
        up_or_down1: '',
        strategy_sname1: '',
        params1: null,
        open_or_close2: 'close',
        up_or_down2: '',
        strategy_sname2: '',
        params2: null,
      }
    },

    showTable(val){

      // this.modelVisible = true
      
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
      list = copyObj(this.contractList).slice(start, end)
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
