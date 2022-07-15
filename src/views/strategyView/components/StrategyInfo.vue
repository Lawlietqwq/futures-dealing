<template>
  <div>
    <el-row>
      <el-col>
        <el-descriptions :title="strategy.strategyName" :column="1" :key="timeStamp" class="strategy-description" :label-style="{'text-align':'center'}" border>
          <el-descriptions-item v-for="item in strategy.strategyParamList" :label="item.paramName" :key="item.paramName" :label-style="{'text-align':'center','background':'#E1F3D8'}">{{item.paramDescription}}</el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { createModel } from '@/api/model'
import { getAllContractCode } from '@/api/contract'
import waves from '@/directive/waves'

export default {
  name: 'StrategyInfo',
  directives: { waves },
  props: {
    strategy:{
      type: Object,
      require: true
    },

  },
  data(){
    return{
      timeStamp: 0,
      dialogFormVisible: false,
      createLoading: false,
      codeList: [],
      model: {
        modelName: '',
        uid: this.$store.getters.uid,
        strategyId: this.strategy.strategyId,
        code: '',
        remark: '',
        buyOrSell: null,
        paramList: []
      },
    }
  },
  watch:{
    strategyName:{
      deep:true,
      handler(){
        this.timeStamp = new Date().getTime()
      }
    }
  },
  computed: {
    ...mapGetters([
      'uid',
    ])
  },
  created(){
    getAllContractCode().then(res=>{ 
        this.codeList = res.data
        }
      )
  },
  methods: {
    
    //el-input bug 需要强制刷新
    change(){
       this.$forceUpdate();
    },

  }
}
</script>

<style lang="scss" scoped>

  .strategy-description{
    margin-top: 1rem;
  }

</style>