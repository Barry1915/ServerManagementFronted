<template>
  <div>
    <div class="pagination-container">  
  <h1 class="server-log-title">133服务器sys日志</h1>  
    </div>  

    <el-table :data="syslog" style="width: 100%" :row-class-name="tableRowClassName">
        <el-table-column
        prop="log"
        label="日志"
        width="auto">
      </el-table-column>   
    </el-table>

    

    <div class="pagination-container">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[50, 100, 150, 200]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="1000000">
    </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      name: 'Ecust',
      syslog: [],
      currentPage:10,
      pageSize:50,
      totalLogCount:0
    }
  },

  methods:{
    tableRowClassName({row, rowIndex}) {
        if (row.log && row.log.includes('高资源')) {
          console.log()
          return 'warning-row';
        } else{
          return 'success-row';
        }

      },

    async fetchLogs(){
      try {
        let url=`http://localhost:5678/syslog/page?page=${this.currentPage}&pageSize=${this.pageSize}`
        await axios.get(url).then((response)=>{
          this.syslog = response.data
          // console.log(response)
        })
        
      } catch (error) {
        console.log('Error:', error)
      }
    },
    handleSizeChange(val) {  
      this.pageSize = val  
      this.currentPage = 1 // 当每页条数改变时，重置页码为第一页  
      this.fetchLogs()  
    },  
    handleCurrentChange(val) {  
      this.currentPage = val  
      this.fetchLogs()  
    }  
  },

  created() {
    this.fetchLogs()
  }
}
</script>


<style>
.el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>


<style scoped>

  .pagination-container {  
    display: flex;  
    justify-content: center; /* 水平居中 */  
    align-items: center; /* 垂直居中，如果需要的话 */  
    height: 100px; /* 或者其他你需要的高度 */  
  }

  
  .pagination-container2 {  
  display: flex;  
  justify-content: center; /* 水平居中 */  
  align-items: center; /* 垂直居中 */  
  height: 100vh; /* 使用视口高度来垂直居中，或者根据需要调整 */  
  margin: 0; /* 移除默认的外边距 */  
  padding: 20px; /* 添加一些内边距 */  
  background-color: #f5f5f5; /* 添加背景色 */  
}  
  
.server-log-title {  
  font-family: 'Arial', sans-serif; /* 使用一个常见的无衬线字体 */  
  color: #333; /* 字体颜色 */  
  font-size: 2em; /* 字体大小 */  
  text-align: center; /* 文本居中 */  
  margin: 0; /* 移除默认的外边距 */  
  padding: 0; /* 移除默认的内边距 */  
  letter-spacing: 1px; /* 字母间距 */  
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 文本阴影，增加立体感 */  
} 
</style>