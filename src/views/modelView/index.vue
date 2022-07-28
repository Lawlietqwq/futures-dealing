<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.modelName" placeholder="模型名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="modelList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
    <el-table-column type="expand">
        <template slot-scope="props">
          <el-descriptions :column="1" :label-style="{'text-align':'center'}" border>
            <el-descriptions-item v-for="param in props.row.openParams" :label="'开仓策略——'+param.paramName" :key="param.paramId" :label-style="{'text-align':'center','background':'#E1F3D8'}">
              {{param.paramValue}}
            </el-descriptions-item>
            <el-descriptions-item v-for="param in props.row.closeParams" :label="'平仓策略——'+param.paramName" :key="param.paramId" :label-style="{'text-align':'center','background':'#FDE2E2'}">
              {{param.paramValue}}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-descriptions :column="1" :label-style="{'text-align':'center'}" border>
            <el-descriptions-item label="创建时间" >
              {{ props.row.createTime }}
            </el-descriptions-item>
            <el-descriptions-item label="策略启动时间" >
              {{ props.row.startTime }}
            </el-descriptions-item>
            <el-descriptions-item label="策略关闭时间" >
              {{ props.row.endTime }}
            </el-descriptions-item>
            <el-descriptions-item v-for="param in props.row.paramList" :label="param.paramName" :key="param.paramId" :label-style="{'text-align':'center','background':'#E1F3D8'}">
              {{param.paramValue}}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column label="序号" type="index" align="center" width="80">
      </el-table-column>
      <el-table-column v-if="false" label="模型Id" prop="modelId" width="0">
      </el-table-column>
      <el-table-column label="合约号" prop="code" width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模型名" prop="modelName" width="150px" align="center">
        <template v-slot="{row}">
          <span class="link-type" @click="showModelDetail(row)">{{ row.modelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合约买卖" prop="buyOrSell" width="80px" align="center">
        <template v-slot="{row}">
          <span>{{ row.buyOrSell?'买':'卖' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模型描述" prop="remark" min-width="150px" align="center">
        <template v-slot="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template v-slot="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
       
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getModelList" />
    
    <!-- 编辑模型 -->
    <el-dialog title="编辑模型" :visible.sync="dialogFormVisible">
      <el-form ref="reviseDom" :model="tmpData"  label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <!-- 修改模型名称 -->
        <el-form-item label="模型名">
          <el-input v-model="tmpData.modelName" />
        </el-form-item>
        <!-- 修改合约 -->
        <el-form-item label="更换合约">
          <el-select v-model="tmpData.code" placeholder="请选择合约">
            <el-option v-for="code in codeList" :key="code" :label="code" :value="code"></el-option>
          </el-select>
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
  name: 'ModelView',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
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
      modelApi.getAllModelByUid().then(res => {
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

    handleUpdate(row) {
      const index = this.modelList.findIndex(model => model.modelId === row.modelId)
      this.tmpData = copyObj(this.modelList[index])
      this.dialogFormVisible = true
      this.$nextTick(() => this.$refs['reviseDom'].clearValidate())
    },

    updateData() {
      this.$refs['reviseDom'].validate((valid) => {
        if (valid) {
          modelApi.updateModel(this.tmpData).then(res => {
            const index = this.modelList.findIndex(model => model.modelId === this.tmpData.modelId)
            this.modelList.splice(index, 1, this.tmpData)
            this.dialogFormVisible = false
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
    // getSortClass: function(key) {
    //   const sort = this.listQuery.sort
    //   return sort === `+${key}` ? 'ascending' : 'descending'
    // },
    
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
