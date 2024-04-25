<template>
  <div>
    <h1>131服务器日志</h1>
    <el-table :data="syslogList" style="width: 100%">
        <el-table-column
        prop="log"
        label="日志"
        width="auto">
      </el-table-column>   
    </el-table>

    <el-pagination
    background
    layout="prev, pager, next"
    :total="1000">
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    data(){
        return {
            syslogList:[]
        }
    },

    async created() {
    try {
      const response = await axios.get('http://localhost:5678/syslog/131')
      this.syslogList = response.data
      console.log(response)
    } catch (error) {
      console.log('Error:', error)
    }
  }
     
}
</script>
