<script setup lang="ts">
import EditableTable from '@lib/components/EditableTable.vue'
import { TeamOutlined } from '@ant-design/icons-vue'
import Item from '@/types/item'
import Column from '@lib/types/column'
import Mapper from '@lib/types/mapper'
import { newOne, setProp, getProp } from '@lib/utils'
import { reactive } from 'vue'
import { cloneDeep } from 'lodash'
import User from '@/types/user'
import Auth, { type AuthInterface } from '@/types/auth'
import NumPairLst from '@/components/NumPairLst.vue'

const dataTable = reactive({
  columns: [new Column('编号', 'id'), new Column('名称', 'name')],
  mapper: new Mapper({
    id: {
      type: 'Button',
      label: 'ID',
      inner: '生成',
      onClick: function (form: Item) {
        form.id = crypto.randomUUID()
      }
    },
    name: {
      type: 'Input',
      label: '名称',
      placeholder: '请输入名称',
      rules: [{ required: true, message: '名称不能为空！' }]
    }
  }),
  api: {
    all: () => dataTable.data,
    add: (item: Item) => {
      dataTable.data.push(cloneDeep(item))
    }
  },
  data: [] as Item[]
})
const options = reactive({
  manageUser: false,
  authVsb: false
})
const userTable = reactive({
  columns: [new Column('姓名', 'name'), new Column('邮箱', 'email')],
  mapper: new Mapper({
    name: {
      type: 'Input',
      label: '姓名',
      placeholder: '请输入姓名'
    },
    email: {
      type: 'Input',
      label: '邮箱',
      placeholder: '请输入邮箱'
    },
    password: {
      type: 'Password',
      label: '密码'
    }
  }),
  api: {
    all: () => userTable.users,
    add: (user: User) => {
      userTable.users.push(cloneDeep(user))
    }
  },
  users: [] as User[]
})
const authTable = reactive({
  columns: [
    {
      title: '*',
      dataIndex: 'desc',
      key: 'desc',
      width: 120,
      align: 'center'
    },
    {
      title: '增',
      dataIndex: 'add',
      key: 'add',
      align: 'center'
    },
    {
      title: '删',
      dataIndex: 'delete',
      key: 'delete',
      align: 'center'
    },
    {
      title: '改',
      dataIndex: 'update',
      key: 'update',
      align: 'center'
    },
    {
      title: '查',
      key: 'query',
      dataIndex: 'query',
      align: 'center'
    }
  ],
  opers: [{ desc: '可否操作' }, { desc: '操作对象' }],
  formState: new Auth()
})
type OperType = keyof AuthInterface
const operDict = {
  add: ['addable'],
  delete: ['deletable', 'delOnlyOwn'],
  update: ['updatable', 'updOnlyOwn'],
  query: ['queriable', 'qryOnlyOwn']
}

function onAuthSubmit() {
  console.log('提交权限配置', authTable.formState)
}
</script>

<template>
  <div class="p-3">
    <EditableTable
      v-if="!options.manageUser"
      title="共享文档"
      :api="dataTable.api"
      :columns="dataTable.columns"
      :mapper="dataTable.mapper"
      :new-fun="() => newOne(Item)"
    >
      <template #description>
        <a-button @click="() => setProp(options, 'manageUser', true)">
          <template #icon><TeamOutlined /></template>
          用户管理
        </a-button>
      </template>
      <template #idEDT="{ editing }: any">
        <a-input-group v-if="editing.id" class="flex" compact>
          <a-button class="flex-1">{{ editing.id }}</a-button>
          <a-button @click="() => dataTable.mapper.id.onClick(editing)">重新生成</a-button>
        </a-input-group>
        <a-button v-else class="w-full" @click="() => dataTable.mapper.id.onClick(editing)">
          生成
        </a-button>
      </template>
    </EditableTable>
    <EditableTable
      v-else
      title="用户管理"
      :api="userTable.api"
      :columns="userTable.columns"
      :mapper="userTable.mapper"
      opera-style="text"
      :new-fun="() => newOne(User)"
    >
      <template #description>
        <a-button @click="() => setProp(options, 'manageUser', false)">
          <template #icon><TeamOutlined /></template>
          数据管理
        </a-button>
      </template>
      <template #operaBefore="{ record }">
        <a-button
          type="link"
          size="small"
          @click="() => {
            setProp(options, 'authVsb', true)
            setProp(authTable, 'formState', record.auth)
          }"
        >
          配置权限
        </a-button>
      </template>
    </EditableTable>
    <a-modal width="80vw" v-model:open="options.authVsb" title="配置权限" @ok="onAuthSubmit">
      <a-table
        bordered
        :columns="authTable.columns"
        :data-source="authTable.opers"
        :pagination="false"
      >
        <template #bodyCell="{ record, column }">
          <a-space v-if="record.desc === '可否操作' && column.dataIndex !== 'desc'">
            <a-switch
              v-model:checked="authTable.formState[getProp(operDict, column.dataIndex + '[0]') as OperType]"
              checked-children="可"
              un-checked-children="否"
            />
            <a-checkbox
              v-if="['delete', 'update', 'query'].includes(column.dataIndex)"
              v-model:checked="authTable.formState[getProp(operDict, column.dataIndex + '[1]') as OperType]"
              :disabled="!authTable.formState[getProp(operDict, column.dataIndex + '[0]') as OperType]"
            >
              只可操作自己创建的记录
            </a-checkbox>
          </a-space>
          <a-form v-else-if="record.desc === '操作对象'" layout="vertical">
            <a-form-item v-if="column.dataIndex === 'desc'" label="操作对象">
              <a-typography-text type="secondary">
                如需操作所有行/单元格，直接使用【*】符号
              </a-typography-text>
            </a-form-item>
            <a-form-item v-if="column.dataIndex === 'add'" label="可添加的记录数">
              <a-input
                :disabled="!authTable.formState.addable"
                type="number"
                placeholder="记录数"
                v-model:value="authTable.formState.canAddNum"
              />
            </a-form-item>
            <a-form-item v-else-if="column.dataIndex === 'delete'">
              <template #label>
                可删除的行数&nbsp;
                <a-typography-text type="secondary">结束行不填代表指定行</a-typography-text>
              </template>
              <NumPairLst
                v-model:num-pair-list="authTable.formState.canDelRows"
                :disabled="!authTable.formState.deletable || authTable.formState.delOnlyOwn"
              />
            </a-form-item>
            <a-form-item v-else-if="column.dataIndex === 'update'" label="可修改的行/单元格">
              <NumPairLst
                v-model:num-pair-list="authTable.formState.canUpdRowCells"
                :disabled="!authTable.formState.updatable || authTable.formState.updOnlyOwn"
                :placeholder="['行号', '列号']"
                split-letter="/"
              />
            </a-form-item>
            <a-form-item v-else-if="column.dataIndex === 'query'" label="可修改的行/单元格">
              <NumPairLst
                v-model:num-pair-list="authTable.formState.canQryRowCells"
                :disabled="!authTable.formState.queriable || authTable.formState.qryOnlyOwn"
                :placeholder="['行号', '列号']"
                split-letter="/"
              />
            </a-form-item>
          </a-form>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>
