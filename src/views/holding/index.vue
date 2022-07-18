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
      :expand-row-keys="rowExpanded"
      ref="modelTable"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @expand-change="changeRowExpanded"
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
          <el-button type="danger" class="opsButton" @click="modelDel(row, index)">删除</el-button>
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
import * as recordApi from '@/utils/record'
import * as authApi from '@/utils/auth'
import * as modelApi from '@/api/model'
import { copyObj } from '@/utils/util'
import Handler from 'zrender/lib/Handler'
import M from 'minimatch'


export default {
  name: 'HoldingPage',
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

  },

  methods:{
    getRecordList(){
      recordApi.getAllRecordByUid(0).then(res => {
        if(res.data){
          this.recordList = res.data
          this.total = this.recordList.length
          this.getList()
        }
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
    },

  }

}
</script>