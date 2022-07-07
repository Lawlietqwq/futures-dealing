<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="modelList"
      row-key="code"
      ref="modelTable"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="合约" prop="code" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合约" prop="code" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合约" prop="code" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getModelList" />
    
    <!-- 添加模型 -->
    <el-dialog title="添加模型" :visible.sync="dialogFormVisible">
      <el-form ref="createForm" :model="tmpData"  label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <!-- 修改模型名称 -->
        <el-form-item label="模型名">
          <el-input v-model="tmpData.modelName" />
        </el-form-item>
        <!-- 修改参数 -->
        <el-form-item v-for="param in tmpData.paramList" :key="param.paramId" :label="param.paramName">
          <el-input placeholder="请填写参数值" v-model="param.paramValue" @input="change()"></el-input>  
        </el-form-item>
        <!-- 合约买or卖 -->
        <el-form-item label="合约买卖">
          <el-radio v-model="tmpData.buyOrSell" :label="true">合约买</el-radio>
          <el-radio v-model="tmpData.buyOrSell" :label="false">合约卖</el-radio>
        </el-form-item>
        <!-- 模型描述 -->
        <el-form-item label="模型描述">
          <el-input v-model="tmpData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消 
        </el-button>
        <el-button type="primary" @click="updateData">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' 
import Pagination from '@/components/Pagination'
import { getAllContractCode } from '@/api/contract'
import * as modelApi from '@/api/model'
import { copyObj } from '@/utils/util'

export default {
  name: 'CreateView',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      multipleSelection: [],
      modelList: [],
      codeList: [],
      timeStamp: 1,
      listQuery: {
        page: 1,
        limit: 20,
        modelName:'',
        sort: '+id'
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      tmp: 0,
      tmpData: {
        modelId: null,
        code: '',
        uid: this.$store.getters.uid,
        modelName: '',
        remark: '',
        paramList: [],
      },
      // rules: {
      //   type: [{ required: true, message: 'type is required', trigger: 'change' }],
      //   timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
      //   title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      // },
    }
  },
  // watch:{
  //   modelId:{
  //     deep:true,
  //     handler(){
  //       this.dialogFormVisible = true
  //     }
  //   }
  // },

  created() {
    this.getModelList()
    this.getContractCode()
  },
  methods: {
    getModelList() {
      this.listLoading = true
      modelApi.getAllModel().then(res => {
        if(res.data) this.modelList = res.data
        this.total = this.modelList.length
        this.listLoading = false
      })
    },
    getContractCode(){
      getAllContractCode().then(res => {
        this.codeList = res.data
      })

    },
    handleFilter() {
      if(this.listQuery.modelName != ''){
        this.querySearch()
        this.listQuery.page = 1
        this.total = this.modelList.length
      }
      else{
          this.getModelList()
      }
    },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },

    handleCreate() {
      this.dialogFormVisible = true
      
      this.$nextTick(() => this.$refs['contractTable'].clearSelection())
    },

    updateData() {
      this.$refs['createForm'].validate((valid) => {
        if (valid) {
          modelApi.updateModel(this.tmpData).then(res => {
            const index = this.modelList.findIndex(model => model.modelId === this.tmpData.modelId)
            this.modelList.splice(index, 1, this.tmpData)
            this.dialogFormVisible = false
            console.log(this.tmpData,'this')
            this.tableKey += 1
            this.$notify({
              title: '模型更新',
              message: '更新成功',
              type: 'success',
              duration: 1000
            })   
          })
        }
      })
    },
    handleDelete(row, index) {
      var that = this
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          modelApi.deleteModel(row.modelId).then(res =>{
            this.$notify({
              title: '模型删除',
              message: '删除成功',
              type: 'success',
              duration: 1000
           })
          that.modelList.splice(index, 1)
        })
      }).catch(() => {         
        });
    },

    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    
    querySearch() {
      var searchData = []
      var vm = this
      this.modelList.forEach(function (item) {
        if (item.modelName.toLowerCase().indexOf(vm.listQuery.modelName.toLowerCase()) > -1) {
          searchData.push(item);
        }
      });
      this.modelList = searchData;
    },
    showModelDetail(row){
        modelApi.getModelById(row.modelId).then(res => {
          this.detailVisable = true
          this.modelDetal = res.data
        })
    },
    //el-input bug 需要强制刷新
    change(){
       this.$forceUpdate();
    },
  }
}
</script>
