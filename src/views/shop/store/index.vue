<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="700px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="商家名称" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="主营项目" prop="bscope">
                <el-input v-model="form.bscope" type="textarea" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商家简介" prop="introduction">
                <el-input v-model="form.introduction" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人" prop="contact">
                <el-input v-model="form.contact" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="form.phone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="商家地址" prop="addrArr">
                <el-cascader
                    style="width: 100%"
                    v-model="form.addrArr"
                    :options="depts"
                    :props="{ value: 'name'}"
                    @change="handleChange"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="" prop="detailedAddress" label-width="0">
                <el-input v-model="form.detailedAddress" placeholder="详细地址"/>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button  size="mini" type="primary" @click="getL(form.addrArr, form.detailedAddress)">获取经纬度</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="纬度" prop="latitude">
                <el-input v-model="form.latitude" :disabled="true" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经度" prop="longitude">
                <el-input v-model="form.longitude" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="营业执照" prop="licenseurl">
                <MaterialList v-model="form.licenseArr" type="image" :num="1" :width="80" :height="80" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="食品经营许可证" prop="bpermissionurl">
                <MaterialList v-model="form.bpermissionArr" type="image" :num="1" :width="80" :height="80" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="法人身份证正面" prop="idcardfronturl">
                <MaterialList v-model="form.idcardfrontArr" type="image" :num="1" :width="80" :height="80" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人身份证反面" prop="idcardbackurl">
                <MaterialList v-model="form.idcardbackArr" type="image" :num="1" :width="80" :height="80" />
              </el-form-item>
            </el-col>
          </el-row>




          <!-- <el-form-item label="商家logo" prop="image">
            <MaterialList v-model="form.imageArr" type="image" :num="1" :width="80" :height="80" />
          </el-form-item>
          
          
          <el-form-item label="是否显示" prop="isShow">
            <el-radio-group v-model="form.isShow" style="width: 178px">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="核销时效" prop="validTime">
                <el-date-picker
                  style="width: 100%"
                  @change="getTimeT"
                  v-model="form.validTimeArr"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业时间" prop="dayTime">
                <el-time-picker
                  style="width: 100%"
                  @change="getTime"
                  is-range
                  v-model="form.dayTimeArr"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>
          
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!-- 审核 -->
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <span>此处展示详情</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">不通过</el-button>
          <el-button type="primary" @click="operOk()">通过</el-button>
        </span>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <!-- <el-table-column v-if="columns.visible('id')" prop="id" label="id" width="50" /> -->
        <el-table-column v-if="columns.visible('name')" prop="name" label="商家名称" />
        <el-table-column v-if="columns.visible('phone')" prop="phone" label="商家电话" />
        <el-table-column v-if="columns.visible('address')" label="地址" >
          <template slot-scope="scope">
            {{ scope.row.address}}{{scope.row.detailedAddress}}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('idcardfronturl')" prop="idcardfronturl" label="身份证正面" >
          <template slot-scope="scope">
            <a :href="scope.row.idcardfronturl" style="color: #42b983" target="_blank"><img :src="scope.row.idcardfronturl" alt="点击打开" class="el-avatar"></a>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('status')" prop="status" label="审核状态" >
          <template slot-scope="scope">
            {{ formatStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="columns.visible('image')" prop="image" label="商家logo" >
          <template slot-scope="scope">
            <a :href="scope.row.image" style="color: #42b983" target="_blank"><img :src="scope.row.image" alt="点击打开" class="el-avatar"></a>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('validTime')" prop="validTime" label="核销有效日期" />
        <el-table-column v-if="columns.visible('isShow')" prop="isShow" label="是否显示" >
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.isShow === 1" :type="''">显示</el-tag>
              <el-tag v-else :type=" 'info' ">隐藏</el-tag>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column v-if="columns.visible('dayTime')" prop="dayTime" label="营业时间" />
        <el-table-column v-permission="['admin','yxSystemStore:edit','yxSystemStore:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status===0" size="mini" type="primary" icon="el-icon-edit" @click="operate(scope.row)" ></el-button>
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
  import crudYxSystemStore from '@/api/yxSystemStore'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import MaterialList from '@/components/material'
  import { parseTime } from '@/utils/index'
  import { getDepts } from '@/api/system/dept'

  // crud交由presenter持有
  const defaultCrud = CRUD({ title: '商家', url: 'api/yxSystemStore', sort: 'id,desc', crudMethod: { ...crudYxSystemStore }})
  const defaultForm = { id: null, name: null, introduction: null, contact: null, phone: null, addrArr: [], address: null, detailedAddress: null, image: null, latitude:
  null, longitude: null, validTime: null, dayTime: null, addTime: null, isShow: 1, imageArr: [], validTimeArr: [],  dayTimeArr: [new Date(),new Date()] }
  export default {
    name: 'YxSystemStore',
    components: { pagination, crudOperation, rrOperation, udOperation, MaterialList },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {
        dialogVisible: false,
        depts: [],
        permission: {
          add: ['admin', 'yxSystemStore:add'],
          edit: ['admin', 'yxSystemStore:edit'],
          del: ['admin', 'yxSystemStore:del']
        },
        rules: {
          name: [
            { required: true, message: '商家名称不能为空', trigger: 'blur' }
          ],
          bscope: [
            { required: true, message: '主营项目不能为空', trigger: 'blur' }
          ],
          introduction: [
            { required: true, message: '简介不能为空', trigger: 'blur' }
          ],
          contact: [
            { required: true, message: '联系人不能为空', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' }
          ],
          addrArr: [
            { required: true, message: '省市区不能为空', trigger: 'change' }
          ],
          detailedAddress: [
            { required: true, message: '详细地址不能为空', trigger: 'blur' }
          ],
          bpermissionurl: [
            { required: true, message: '食品许可证不能为空', trigger: 'blur' }
          ],
          // licenseurl: [],
          latitude: [
            { required: true, message: '纬度不能为空', trigger: 'blur' }
          ],
          longitude: [
            { required: true, message: '经度不能为空', trigger: 'blur' }
          ],
          isShow: [
            { required: true, message: '是否显示不能为空', trigger: 'blur' }
          ]
        }
        }
    },
    methods: {
      [CRUD.HOOK.beforeToCU]() {
        getDepts({ enabled: true }).then(res => {
          this.depts = res.content[0].children
        })
      },
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },
      // 添加后
      [CRUD.HOOK.beforeSubmit]() {
        //console.log('hah:'+this.form.imageArr)
        this.form.image = this.form.imageArr.join(',')
      },
      // 编辑前
      [CRUD.HOOK.beforeToEdit](crud, form) {
        form.imageArr = [form.image]
        form.dayTimeArr = [form.dayTimeStart,form.dayTimeEnd]
        form.validTimeArr = [form.validTimeStart,form.validTimeEnd]
      },
      getTime(t) {
        this.form.dayTimeStart = t[0]
        this.form.dayTimeEnd = t[1]
        this.form.dayTime = parseTime(t[0],'{h}:{i}:{s}') + ' - ' + parseTime(t[1],'{h}:{i}:{s}')
      },
      getTimeT(t) {
        this.form.validTimeStart = t[0]
        this.form.validTimeEnd = t[1]
        this.form.validTime = parseTime(t[0],'{y}-{m}-{d}') + ' - ' + parseTime(t[1],'{y}-{m}-{d}')
      },
      getL(area, addr) {
        console.log(area,'kkkkkkk')
        this.yanzheng()
        this.form.address = area.join('')
        crudYxSystemStore.getL({ addr: `${this.form.address}${this.form.detailedAddress}` }).then(res => {
          this.form.latitude = res.result.location.lat
          this.form.longitude = res.result.location.lng

          //console.log(this.form)
        })
      },
      yanzheng() {
        if (this.form.addrArr.length === 0 || !this.form.detailedAddress) {
          this.$notify({
            title: '地区和详细地址不能为空',
            type: 'warning'
          })
          return false
        }
        return true
      },
      handleChange() {},
      formatStatus(status) {
        switch (status) {
          case 0 : return '未审核';
          case -1 : return '未通过';
          case 1 : return '通过';
        }
      },
      operate(data) {
        this.dialogVisible = true
        console.log(data,'ooooo')
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      operOk() {
        // 调接口传1和-1
        this.dialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
