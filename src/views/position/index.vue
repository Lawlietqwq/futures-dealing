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
      ref="positionTable"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >

      <el-table-column label="序号" type="index" align="center" width="100rem">
      </el-table-column>
      <el-table-column v-if="false" label="持仓id" prop="holdingId" width="0px">
        <template v-slot="{row}">
          <span>{{ row.holdingId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合约" prop="code" width="200rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="openName" label="开仓策略" width="400rem" align="center">
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
      <el-table-column prop="closeName" label="平仓策略" width="400rem" align="center">
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
      <el-table-column prop="bkOrSk" label="买卖方向" width="150rem" align="center"> 
        <template v-slot="{row}">
          <span>{{ row.bkOrSk==0?'做多':'做空' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开仓手数" prop="openNum" width="150rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.openNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开仓价格" prop="openPrice" width="300rem" align="center">
        <template v-slot="{row}">
          <span>{{ row.openPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开仓时间" prop="openTime" align="center">
        <template v-slot="{row}">
          <span>{{ row.openTime }}</span>
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
import * as positionApi from '@/api/position'
import * as authApi from '@/utils/auth'
import { copyObj } from '@/utils/util'


export default {
  name: 'PositionPage',
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
      positionList: [],
    }
  },

  created(){
    this.getPositionList()
    // taskApi.continuedTarget(this.continuedTask , 5000)
  },

  methods:{
    getPositionList(){
      positionApi.getAllHoldingByUid().then(res => {
        if(res.data){
          this.positionList = res.data
          this.total = this.positionList.length
          this.getList()
        }
      })
    },

    continuedTask(){
      positionApi.getAllHoldingByUid().then(res => {
        if(res.data){
          this.positionList = res.data
          this.total = this.positionList.length
          this.getList()
          }
        })
    },


    handleFilter() {
      if(this.listQuery.code.trim() != ''){
        this.querySearch()
        this.listQuery.page = 1
        this.total = this.positionList.length
        this.getList()
      }
      else{
        this.getPositionList()
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
      this.getPositionList()
      var searchData = []
      var vm = this
      this.positionList.forEach(function (item) {
        if (item.code.toLowerCase().indexOf(vm.listQuery.code.toLowerCase()) > -1) {
          searchData.push(item);
        }
      });
      this.positionList = searchData;
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
      list = copyObj(this.positionList).slice(start, end)
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