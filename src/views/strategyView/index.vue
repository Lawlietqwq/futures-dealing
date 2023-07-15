<template>
  <div class="strategyView-container">
    
    <el-row :gutter="32" justify="space-around">
      <el-col :span="wapperSpan">
        <div class="div-wrapper">
          <strategy-list @selectStrategy="selectStrategy" />
        </div>
      </el-col>
      <el-col v-if="isHidden" :span="16">
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
import strategyList from './components/StrategyList.vue'
import strategyInfo from './components/StrategyInfo.vue'

export default {
  name: 'StrategyPage',

  components:{
    strategyList,
    strategyInfo
  },

  data(){
    return{
      strategy: null,
      isHidden: false,
      wapperSpan: 24,
    }
  },

  computed: {
    ...mapGetters([
      'uid',
    ])
  },

  methods: {
    selectStrategy(strategyId){
        getStrategyById(strategyId).then(res=>{
          if(res.data){
            this.strategy = res.data
            this.isHidden = true
            this.wapperSpan = 8
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