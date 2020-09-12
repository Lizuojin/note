<template>
  <div>
    <el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
      <el-row :gutter="15">
        <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-col :span="24">
            <el-form-item label="多选框组" prop="field101">
              <el-checkbox-group v-model="formData.field101" size="medium">
                <el-checkbox v-for="(item, index) in field101Options" :key="index" :label="item.value"
                  :disabled="item.disabled">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开关" prop="field103" required>
              <el-switch v-model="formData.field103"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="上传" prop="field105" required>
              <el-upload ref="field105" :file-list="field105fileList" :action="field105Action"
                :before-upload="field105BeforeUpload">
                <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  components: {},
  props: [],
  data() {
    return {
      formData: {
        field101: [],
        field103: false,
        field105: null,
      },
      rules: {
        field101: [{
          required: true,
          type: 'array',
          message: '请至少选择一个field101',
          trigger: 'change'
        }],
      },
      field105Action: 'https://jsonplaceholder.typicode.com/posts/',
      field105fileList: [],
      field101Options: [{
        "label": "选项一",
        "value": 1
      }, {
        "label": "选项二",
        "value": 2
      }],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs['elForm'].resetFields()
    },
    close() {
      this.$emit('update:visible', false)
    },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.close()
      })
    },
    field105BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      return isRightSize
    },
  }
}

</script>
<style>
.el-upload__tip {
  line-height: 1.2;
}

</style>
