<template>
  <div>
    <el-row>
      <el-col>
      </el-col>
      <el-col>
        <el-descriptions :title="strategy.strategyName" :column="1" :key="timeStamp" border>
          <el-descriptions-item v-for="item in strategy.paramNameList" :label="item.paramName" :key="item.paramName">{{item.paramDescription}}</el-descriptions-item>
          <el-descriptions-item label="策略描述">
            {{strategy.remark}}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-dialog :title="strategy.strategyName" :visible.sync="dialogFormVisible">
      <el-form ref="createForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="模型名">
          <el-input v-model="temp.modelName" />
        </el-form-item>
        <!-- 选择合约 -->
        <el-form-item>

        </el-form-item>
        <!-- 选择参数 -->
        <el-form-item>
          
        </el-form-item>
        <el-form-item label="模型描述">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消 
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { createModel } from '@/api/model'

export default {
  name: 'StrategyInfo',
  props: {
    strategy:{
      type:Object,
      require: true
    }
    // strategyId: {
    //   type: Number,
    //   require: true
    // },
    // strategyName: {
    //   type: String,
    //   require: true
    // },
    // remark: {
    //   type: String,
    //   default: ''
    // },
    // paramNameList: {
    //   type: Array,
    //   default: []
    // },
  },
  data(){
    return{
      timeStamp: 0,
      dialogFormVisible: false,
      listLoading: true,
      allStrategy: [],
      temp: {
        modelName: '',
        contract: '',
        remark: '',
        buyOrSell:null,
        paramList:{
        }
      },
    }
  },
  watch:{
    strategyId:{
      deep:true,
      handle(){
        this.timeStamp = new Date().getTime()
      }
    }
  },
  computed: {
    ...mapGetters([
      'uid',
    ])
  },
  methods: {

    createModelFromTemplate(model){
      createModel(model).then(res=>{
        return true
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