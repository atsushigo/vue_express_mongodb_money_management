<template>
    <div class="fillcontain">
        <div>
            <el-form
                :inline="true"
                ref="search_data" 
                :model='search_data' >
                <el-form-item label="按照時間:">
                    <el-date-picker
                        v-model="search_data.startTime"
                        type="datetime"
                        placeholder="選擇開始時間">
                    </el-date-picker> --
                    <el-date-picker
                        v-model="search_data.endTime"
                        type="datetime"
                        placeholder="選擇結束時間">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size ="small" icon="search" @click='onScreeoutMoney()'>篩選</el-button>
                </el-form-item>
                 <el-form-item class="btnRight">
                    <el-button type="primary" size ="small" icon="view" @click='onAddMoney()'>添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                v-if="tableData.length > 0"
                :data='tableData'
                max-height="450"
                border
                :default-sort = "{prop: 'date', order: 'descending'}"
                style="width: 100%">
                 <el-table-column
                    type="index"
                    label="序號"
                    align='center'
                    width="70">
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="創建時間"
                    align='center'
                    width="250"
                    sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px">{{ scope.row.date }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="收支類型"
                    align='center'
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="describe"
                    label="收支描述"
                    align='center'
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="income"
                    label="收入"
                    align='center'
                    width="170"> 
                    <template slot-scope="scope">  
                        <span style="color:#00d053">+ {{ scope.row.income }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="expend"
                    label="支出"
                    align='center'
                    width="170">
                    <template slot-scope="scope">  
                        <span style="color:#f56767">- {{ scope.row.expend }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="cash"
                    label="帳戶現金"
                    align='center'
                    width="170">
                    <template slot-scope="scope">  
                        <span style="color:#4db3ff">{{ scope.row.cash }}</span>
                    </template>
                </el-table-column>
                 <el-table-column
                    prop="remark"
                    label="備註"
                    align='center'
                    width="220">
                </el-table-column>
                <el-table-column
                    prop="operation"
                    align='center'
                    label="操作"
                    fixed="right"
                    width="180">
                    <template slot-scope='scope'>
                        <el-button 
                            type="warning" 
                            icon='edit' 
                            size="small"
                            @click='onEditMoney(scope.row)'
                        >編輯</el-button>
                        <el-button 
                            type="danger" 
                            icon='delete' 
                            size="small"
                            @click='onDeleteMoney(scope.row,scope.$index)'
                        >刪除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
             <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                            v-if='paginations.total > 0'
                            :page-sizes="paginations.page_sizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout"
                            :total="paginations.total"
                            :current-page.sync='paginations.page_index'
                            @current-change='handleCurrentChange'
                            @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 弹框页面 -->
        <DialogFound :dialog='dialog' :form='form' @update="getProfile"></DialogFound>
    </div>
</template>

<script>
import DialogFound from "../components/DialogFound";

export default {
  name: "fundlist",
  data() {
    return {
      tableData: [],
      allTableData: [],
      filterTableData: [],
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      form: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      },
      //需要給分頁傳的訊息
      paginations: {
        page_index: 1, // 當前位於哪頁
        total: 0, // 總數
        page_size: 5, // 1頁顯示多少條
        page_sizes: [5, 10, 15, 20], //每頁顯示多少條
        layout: "total, sizes, prev, pager, next, jumper" // 翻頁屬性
      },
      search_data: {
        startTime: "",
        endTime: ""
      }
    };
  },
  components: {
    DialogFound
  },
  created() {
    this.getProfile();
  },
  methods: {
    getProfile() {
      // 獲取表格屬性
      this.$axios("/api/profile").then(res => {
        // this.tableData = res.data;
        this.allTableData = res.data;
        this.filterTableData = res.data;
        // 設置分頁數據
        this.setPaginations();
      });
    },
    onEditMoney(row) {
      // 編輯
      this.dialog = {
        show: true,
        title: "修改資金信息",
        option: "edit"
      };
      this.form = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
    },
    onDeleteMoney(row, index) {
      // 刪除
      this.$axios.delete(`/api/profile/delete/${row._id}`).then(res => {
        this.$message("刪除成功");
        this.getProfile();
      });
    },
    onAddMoney() {
      // 添加
      this.dialog = {
        show: true,
        title: "添加資金信息",
        option: "add"
      };
      this.form = {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      };
    },
    handleCurrentChange(page) {
      // 當前頁
      let sortnum = this.paginations.page_size * (page - 1);
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum;
      });
      // 設置默認分頁數據
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSizeChange(page_size) {
      // 切換size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    setPaginations() {
      // 總頁數
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 設置默認分頁數據
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    onScreeoutMoney() {
      // 篩選
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({
          type: "warning",
          message: "請選擇時間區間"
        });
        this.getProfile();
        return;
      }
      const stime = this.search_data.startTime.getTime();
      const etime = this.search_data.endTime.getTime();
      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= stime && time <= etime;
      });
      // 分頁數據
      this.setPaginations();
    }
  }
};
</script>
<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>