<template>
  <el-table
    :data="allStrategy"
    style="width: 100%"
    @row-click="selectStrategy">
    <el-table-column
      v-if="false"
      prop="strategyId"
      label="策略Id"
      min-width="1">
    </el-table-column>
    <el-table-column
      prop="strategyName"
      label="策略名"
      width="100%">
    </el-table-column>
  </el-table>
</template>


<script>
import {getAllStrategy} from '@/api/strategy'

export default {
  name: 'StrategyList',

  data(){
    return{
      listLoading: true,
      allStrategy: [],
      nameAndRemark: [],
    }
  },
  created(){
    allStrategy = this.getStrategyList()
  },
  methods: {
    getStrategyList(){
      this.loading = true
      getAllStrategy().then(res=>{
        if(!res.data){
          this.loading = false
          return res.data
        }
      })
    },
    selectStrategy(row){
      this.$emit('selectStrategy',row.strategyId)
    }
  }
}
</script>
