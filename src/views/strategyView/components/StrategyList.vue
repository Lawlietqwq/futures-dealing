<template>
  <el-table
    :data="allStrategy"
    :header-cell-style="{textAlign: 'center'}"
    :cell-style="{textAlign: 'center'}"
    style="width: 100%"
    @row-click="selectStrategy"
    >
    <el-table-column
      v-if="false"
      prop="strategyId"
      label="策略Id"
      width="0">
    </el-table-column>
    <el-table-column
      prop="strategyName"
      label="策略名">
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
    this.getStrategyList()
    setTimeout(() => {
    }, 5000);
    
  },
  methods: {
    getStrategyList(){
      getAllStrategy().then(res=>{
        if(res.data){
          this.allStrategy = res.data
        }
      })
    },
    selectStrategy(row){
      this.$emit('selectStrategy',row.strategyId)
    }
  }
}
</script>
