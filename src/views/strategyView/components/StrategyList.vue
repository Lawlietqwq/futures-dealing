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
    this.allStrategy = this.getStrategyList()
    console.log(this.allStrategy)
  },
  methods: {
    getStrategyList(){
      console.log('woai')
      getAllStrategy().then(res=>{
        console.log(res.data,'asdasd')
        if(res.data){
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
