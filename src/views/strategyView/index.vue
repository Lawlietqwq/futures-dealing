<template>
  <div class="strategyView-container">
    
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="div-wrapper">
          <strategy-list @selectStrategy="selectStrategy" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="div-wrapper">
          <strategy-info :strategy ="strategy"/>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getStrategyById } from '@/api/strategy'
import StrategyList from 'components/StrategyList.vue'
import StrategyInfo from 'components/StrategyInfo.vue'

export default {
  name: 'StrategyView',

  components:{
    StrategyList,
    StrategyInfo
  },

  data(){
    return{
      listLoading: true,
      strategy: [],
    }
  },

  computed: {
    ...mapGetters([
      'uid',
    ])
  },

  methods: {
    selectStrategy(strategyId){
      this.loading = true
        getStrategyById(strategyId).then(res=>{
          if(!res.data){
            this.loading = false
            return res.data
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.strategyView-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .div-wrapper{
    background: #fff;
    padding: 16px;
  }
}
</style>