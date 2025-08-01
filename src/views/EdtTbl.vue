<script setup lang="ts">
import EditableTable from '@lib/components/EditableTable.vue'
import { TeamOutlined } from '@ant-design/icons-vue'
import Item from '@/types/item'
import Column from '@lib/types/column'
import Mapper from '@lib/types/mapper'
import { newOne, setProp } from '@lib/utils'
import { reactive } from 'vue'
import { cloneDeep } from 'lodash'
import User from '@/types/user'

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
  opers: [{ desc: '可否操作' }, { desc: '操作对象' }]
})

function onAuthSubmit() {
  console.log('TTTTTTTTTTTTTT')
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
        <a-button type="link" size="small" @click="() => setProp(options, 'authVsb', true)">
          配置权限
        </a-button>
      </template>
    </EditableTable>
    <a-modal width="80vw" v-model:open="options.authVsb" title="配置权限" @ok="onAuthSubmit">
      <a-table bordered :columns="authTable.columns" :data-source="authTable.opers">
        <template #bodyCell="{ record, column }">
          <template v-if="record.desc === '可否操作' && column.dataIndex !== 'desc'">
            <a-switch
              v-model:checked="record[column.dataIndex]"
              checked-children="可"
              un-checked-children="否"
            />
          </template>
          <a-form v-else-if="record.desc === '操作对象'" layout="vertical">
            <a-form-item v-if="column.dataIndex === 'desc'" label="操作对象">
              <a-typography-text type="secondary">
                如需操作所有行/单元格，直接使用【*】符号
              </a-typography-text>
            </a-form-item>
            <a-form-item v-if="column.dataIndex === 'add'" label="可添加的记录数">
              <a-input type="number" placeholder="记录数" v-model:value="record.add" />
            </a-form-item>
            <a-form-item v-else-if="column.dataIndex === 'delete'">
              <template #label>
                可删除的行数&nbsp;
                <a-typography-text type="secondary">结束行不填代表指定行</a-typography-text>
              </template>
              <a-input-group class="flex" compact>
                <a-input
                  class="flex-1 border-e-0"
                  type="number"
                  placeholder="开始行"
                  v-model:value="record.delete"
                />
                <a-input class="w-5 bg-white p-0 border-x-0" disabled placeholder="~" />
                <a-input
                  class="flex-1 border-s-0"
                  type="number"
                  placeholder="结束行"
                  v-model:value="record.delete"
                />
                <a-button type="primary">添加</a-button>
              </a-input-group>
            </a-form-item>
            <a-form-item v-else-if="column.dataIndex === 'update'" label="可修改的行/单元格">
              <a-input-group class="flex" compact>
                <a-input
                  class="flex-1 border-e-0"
                  type="number"
                  placeholder="行号"
                  v-model:value="record.update"
                />
                <a-input class="w-5 bg-white p-0 border-x-0" disabled placeholder="/" />
                <a-input
                  class="flex-1 border-s-0"
                  type="number"
                  placeholder="列号"
                  v-model:value="record.update"
                />
                <a-button type="primary">添加</a-button>
              </a-input-group>
            </a-form-item>
            <a-form-item v-else-if="column.dataIndex === 'query'" label="可修改的行/单元格">
              <a-input-group class="flex" compact>
                <a-input
                  class="flex-1 border-e-0"
                  type="number"
                  placeholder="行号"
                  v-model:value="record.query"
                />
                <a-input class="w-5 bg-white p-0 border-x-0" disabled placeholder="/" />
                <a-input
                  class="flex-1 border-s-0"
                  type="number"
                  placeholder="列号"
                  v-model:value="record.query"
                />
                <a-button type="primary">添加</a-button>
              </a-input-group>
            </a-form-item>
          </a-form>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>
