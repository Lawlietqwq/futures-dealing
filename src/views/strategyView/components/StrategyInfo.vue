<template>
  <div>
    <el-row>
      <el-col>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-circle-plus" @click="handleCreate">
          新建模型
        </el-button>
      </el-col>
      <el-col>
        <el-descriptions :title="strategy.strategyName" :column="1" :key="timeStamp" class="strategy-description" border>
          <el-descriptions-item v-for="item in strategy.paramNameList" :label="item.paramName" :key="item.paramName">{{item.paramDescription}}</el-descriptions-item>
          <el-descriptions-item label="策略描述">
            {{strategy.remark}}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-dialog :title="strategy.strategyName" :visible.sync="dialogFormVisible">
      <el-form ref="createForm" :rules="rules" :model="model" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="模型名">
          <el-input v-model="model.modelName" />
        </el-form-item>
        <!-- 选择合约 -->
        <el-form-item label="选择合约">
          <el-select v-model="model.contract" placeholder="请选择合约">
            <el-option v-for="contract in codeList" :key="contract" :label="contract" :value="contract"></el-option>
          </el-select>
        </el-form-item>
        <!-- 选择参数 -->
        <el-form-item v-for="param in model.paramList" :key="param">
            {{param}}
          <el-input placeholder="请填写参数值" v-model="model.paramList[param]"></el-input>  
        </el-form-item>
        <!-- 买or卖 -->
        <el-form-item label="合约买卖">
          <el-radio v-model="model.buyOrSell" label="true">合约买</el-radio>
          <el-radio v-model="model.buyOrSell" label="false">合约卖</el-radio>
        </el-form-item>
        <el-form-item label="模型描述">
          <el-input v-model="model.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消 
        </el-button>
        <el-button type="primary" @click="createModelFromTemplate()">
          确认
        </el-button>
      </div>
    </el-dialog>
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
      createLoading: false,
      allStrategy: [],
      codeList: [],
      model: {
        modelName: '',
        contract: '',
        remark: '',
        buyOrSell: null,
        paramList: {}
      },
    }
  },
  watch:{
    strategyId:{
      deep:true,
      handle(){
        this.timeStamp = new Date().getTime()
        this.ifShown = true
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
      this.createLoading = true
      createModel(model).then(res=>{
        this.createLoading = false
        this.$message({
          message: '新建成功',
          type: 'success'
        })
        return true
      })
      .catch(e => {
        this.createLoading = false
        return false
    })
    },
    getAllContract() {
      getAllContractCode().then(res=>{ 
        this.codeList = res.data
        var that = this
        this.codeList.map((code)=>that.model.paramList.set(code,null))
      })
    },
    handleCreate(){
      this.getAllContract()
      this.dialogFormVisible = true
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

  .strategy-description{
    margin-top: 1rem;
  }
}
</style>