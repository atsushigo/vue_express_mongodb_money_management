<template>
    <div class="logFund">
         <el-dialog 
            :title="dialog.title" 
            :visible.sync="dialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false">
            <div class="form">
                <el-form 
                    ref="form" 
                    :model="form"
                    :rules="form_rules"
                    label-width="120px" 
                    style="margin:10px;width:auto;">

                    <el-form-item label="收支類型:" >
                        <el-select v-model="form.type" placeholder="收支類型">
                            <el-option
                             v-for="(formtype, index) in format_type_list"
                             :key="index" 
                             :label="formtype" :value="formtype"
                            ></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop='describe' label="收支描述:">
                        <el-input type="describe" v-model="form.describe"></el-input>
                    </el-form-item>

                    <el-form-item prop='income'  label="收入:">
                        <el-input type="income" v-model="form.income"></el-input>
                    </el-form-item>

                    <el-form-item prop='expend' label="支出:">
                        <el-input type="expend" v-model="form.expend"></el-input>
                    </el-form-item>

                    <el-form-item prop='cash' label="帳戶現金:">
                        <el-input type="cash" v-model="form.cash"></el-input>
                    </el-form-item>

                     <el-form-item label="備註:">
                        <el-input type="textarea" v-model="form.remark"></el-input>
                    </el-form-item>

                    <el-form-item  class="text_right">
                        <el-button @click="dialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: "logfound",
  props: {
    dialog: Object,
    form: Object
  },
  data() {
    return {
      format_type_list: [
        "領現",
        "領現手續費",
        "充值",
        "優惠券",
        "充值禮券",
        "轉帳"
      ],
      form_rules: {
        describe: [
          { required: true, message: "收支描述不能為空", trigger: "blur" }
        ],
        income: [
          { required: true, message: "收入不能為空", trigger: "blur" }
        ],
        expend: [
          { required: true, message: "支出不能為空", trigger: "blur" }
        ],
        cash: [{ required: true, message: "帳戶不能為空", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //form驗證成功後才提交;
          const url =
            this.dialog.option == "add" ? "add" : `edit/${this.form.id}`;
          this.$axios.post(`/api/profile/${url}`, this.form).then(res => {
            // 操作成功
            this.$message({
              message: "保存成功！",
              type: "success"
            });
            this.dialog.show = true;
            this.$emit("update");
          });
        }
      });
    }
  }
};
</script>

