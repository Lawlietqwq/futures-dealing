<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.code" placeholder="合约号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="futureList"
      row-key="code"
      ref="contractTable"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        :reserve-selection="true"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="合约" prop="code" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getModelList" />
    <!-- 添加策略实例 -->
      <el-dialog title="添加策略实例" :visible.sync="dialogFormVisible">
        <div>
          <el-form ref="createForm" :model="tmpData"  label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
            <!-- 选择买入策略 -->
            <el-form-item label="买入策略">
              <el-select v-model="tmpData.code" placeholder="请选择买入策略">
                <el-option v-for="code in codeList" :key="code" :label="code" :value="code" @change="showTable(val)"></el-option>
              </el-select>
            </el-form-item>
            <!-- 修改买入策略参数 -->
            <el-form-item v-for="param in tmpData.paramList" :key="param.paramId" :label="param.paramName">
              <el-input placeholder="请填写参数值" v-model="param.paramValue" @input="change()"></el-input>  
            </el-form-item>
            <el-divider></el-divider>
            <!-- 选择卖出策略 -->
            <el-form-item label="卖出策略">
              <el-select v-model="tmpData.code" placeholder="请选择卖出策略">
                <el-option v-for="code in codeList" :key="code" :label="code" :value="code" @change="showTable(val)"></el-option>
              </el-select>
            </el-form-item>
            <!-- 修改卖出策略参数参数 -->
            <el-form-item v-for="param in tmpData.paramList" :key="param.paramId" :label="param.paramName">
              <el-input placeholder="请填写参数值" v-model="param.paramValue" @input="change()"></el-input>  
            </el-form-item>
            <!-- 模型描述 -->
            <el-form-item label="模型描述">
              <el-input v-model="tmpData.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
            </el-form-item>
          </el-form>
          <el-table
            :data="modelList"
            style="margin-left: 20px;"
            v-if="modelVisible">
            <el-table-column
              prop="code"
              label="合约"
            >
            </el-table-column>
            <el-table-column
              v-for="param in modelList[0].paramList"
              :key="param.paramValue"
              prop="paramList.paramValue"
              :label="param.paramName"
            >
            </el-table-column>
          </el-table>
        </div>
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
      listLoading: false,
      dialogFormVisible: false,
      modelVisible: false,
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
    // this.getModelList()
    // this.getContractCode()
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

    showTable(val){
      this.modelVisible = true
      //获取table参数,按code和val(策略)筛选
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
