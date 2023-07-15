<template>
  <div>
    <el-row>
      <el-col>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-circle-plus" @click="handleCreate">
          新建模型
        </el-button>
      </el-col>
      <el-col>
        <el-descriptions :title="strategy.strategyName" :column="1" :key="timeStamp" class="strategy-description" :label-style="{'text-align':'center'}" border>
          <el-descriptions-item v-for="item in strategy.strategyParamList" :label="item.paramName" :key="item.paramName" :label-style="{'text-align':'center','background':'#E1F3D8'}">{{item.paramDescription}}</el-descriptions-item>
          <el-descriptions-item label="策略描述" >
            {{strategy.remark}}
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-dialog :title="strategy.strategyName" :visible.sync="dialogFormVisible">
      <el-form :model="model" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="模型名">
          <el-input v-model="model.modelName" />
        </el-form-item>
        <!-- 选择合约 -->
        <el-form-item label="选择合约">
          <el-select v-model="model.code" placeholder="请选择合约">
            <el-option v-for="code in codeList" :key="code" :label="code" :value="code"></el-option>
          </el-select>
        </el-form-item>
        <!-- 选择参数 -->
        <el-form-item v-for="param in model.paramList" :key="param.paramName" :label="param.paramName">
          <el-input placeholder="请填写参数值" v-model="param.paramValue" @input="change()"></el-input>  
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
        <el-button type="primary" @click="createModelFromTemplate()">
          确认
        </el-button>
        <el-button @click="dialogFormVisible = false">
          取消 
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
  name: 'Strategyxx',
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
    createModelFromTemplate(){
      const model = this.model
      this.createLoading = true
      createModel(model).then(res=>{
        this.createLoading = false
        this.dialogFormVisible = false
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

    handleCreate(){
      this.resetModel()
      var paramList = this.model.paramList
      this.strategy.strategyParamList.forEach(param=>{paramList.push({
        paramName: param.paramName,
        paramValue: null,
      })})     
      this.dialogFormVisible = true
    },
    //重置表单
    resetModel(){
      this.model = {
        modelName: '',
        uid: this.$store.getters.uid,
        strategyId: this.strategy.strategyId,
        code: '',
        remark: '',
        buyOrSell: null,
        paramList: []
      }
    },

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