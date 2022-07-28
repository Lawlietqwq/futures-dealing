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
      ref="recordTable"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >

      <el-table-column label="序号" type="index" align="center" width="100rem">
      </el-table-column>
      <el-table-column v-if="false" label="记录id" prop="recordId" width="0px">
        <template v-slot="{row}">
          <span>{{ row.recordId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合约" prop="code" width="200rem" align="center">
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
      <el-table-column prop="bkOrSk" label="买卖方向" width="100rem" align="center"> 
        <template v-slot="{row}">
          <span>{{ row.bkOrSk==0?'做多':'做空' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手数" prop="lot" width="100rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.lot }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开仓价格" prop="openPrice" width="200rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.openPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开仓时间" prop="openTime" width="250rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.openTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平仓价格" prop="closePrice" width="200rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.closePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平仓时间" prop="closeTime" width="250rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.closeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收益" prop="profit" width="150rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.profit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="{row}">
          <el-button type="danger" class="opsButton" @click="recordDel(row, index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
import waves from '@/directive/waves' 
import Pagination from '@/components/Pagination'
import * as taskApi from '@/utils/timer'
import * as recordApi from '@/api/record'
import * as authApi from '@/utils/auth'
import { copyObj } from '@/utils/util'


export default {
  name: 'RecordPage',
  components: { Pagination },
  directives: { waves },
  data(){
    return{
      tableKey: 0,
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        limit: 20,
        code:'',
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      recordList: [],
    }
  },

  created(){
    this.getRecordList()
    // taskApi.continuedTarget(this.continuedTask, 5000)
  },

  methods:{
    getRecordList(){
      recordApi.getAllRecordByUid().then(res => {
        if(res.data){
          this.recordList = res.data
          this.total = this.recordList.length
          this.getList()
        }
      })
    },

    continuedTask(){
      recordApi.getAllRecordByUid().then(res => {
        if(res.data){
          this.recordList = res.data
          this.total = this.recordList.length
          this.getList()
          }
        })
    },

    recordDel(row){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            await recordApi.deleteByRecordId(row.recordId)
            this.$notify({
              title: '模型删除',
              message: '删除成功',
              type: 'success',
              duration: 1000
            })
            this.recordList.splice(row.seq, 1)
            this.getList()
            this.tableKey++
        })
    },

    handleFilter() {
      if(this.listQuery.code.trim() != ''){
        this.getRecordList()
        this.querySearch()
        this.listQuery.page = 1
        this.total = this.recordList.length
        this.getList()
      }
      else{
        this.getRecordList()
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
      this.recordList.forEach(function (item) {
        if (item.code.toLowerCase().indexOf(vm.listQuery.code.toLowerCase()) > -1) {
          searchData.push(item);
        }
      });
      this.recordList = searchData;
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
      list = copyObj(this.recordList).slice(start, end)
      list.forEach((item, index) => {
        item.seq = index + start
      })
      this.list = list
      this.tableKey++
      return list
    },

  }

}
</script>