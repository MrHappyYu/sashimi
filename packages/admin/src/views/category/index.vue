<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">分类管理</span>
      <a-button type="primary" style="background: #c9a96e; border: none" @click="openAdd">
        <template #icon><PlusOutlined /></template>新增分类
      </a-button>
    </div>

    <a-table
      :data-source="list"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 1 ? 'green' : 'red'">
            {{ record.status === 1 ? '正常' : '禁用' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a style="color: #c9a96e" @click="openEdit(record as CategoryForm)">编辑</a>
            <a-popconfirm title="确认删除？" @confirm="deleteItem((record as CategoryForm).id!)">
              <a style="color: #ff4d4f">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑分类' : '新增分类'"
      :confirm-loading="saving"
      @ok="handleSave"
      @cancel="formRef?.resetFields()"
    >
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
        <a-form-item label="分类名称" name="name">
          <a-input v-model:value="form.name" placeholder="如：三文鱼系列" />
        </a-form-item>
        <a-form-item label="图标URL" name="icon">
          <a-input v-model:value="form.icon" placeholder="图标链接（可选）" />
        </a-form-item>
        <a-form-item label="排序" name="sort">
          <a-input-number v-model:value="form.sort" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select v-model:value="form.status">
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { message, type FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { PlusOutlined } from '@ant-design/icons-vue'
import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryForm,
} from '@/api/category'

const list = ref<CategoryForm[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<CategoryForm>({ id: null, name: '', icon: '', sort: 0, status: 1 })

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
}

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '分类名称', dataIndex: 'name' },
  { title: '排序', dataIndex: 'sort', width: 80 },
  { title: '状态', key: 'status', width: 100 },
  { title: '操作', key: 'action', width: 140 },
]

async function loadList() {
  loading.value = true
  try {
    list.value = await getCategoryList()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openAdd() {
  isEdit.value = false
  Object.assign(form, { id: null, name: '', icon: '', sort: 0, status: 1 })
  modalVisible.value = true
}

function openEdit(record: CategoryForm) {
  isEdit.value = true
  Object.assign(form, record)
  modalVisible.value = true
}

async function handleSave() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  saving.value = true
  try {
    if (isEdit.value) {
      await updateCategory(form)
    } else {
      await createCategory(form)
    }
    message.success('保存成功')
    modalVisible.value = false
    loadList()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

async function deleteItem(id: number) {
  try {
    await deleteCategory(id)
    message.success('删除成功')
    loadList()
  } catch (e: any) {
    const msg = typeof e === 'string' ? e : e?.message || '删除失败'
    message.error(msg)
  }
}

onMounted(loadList)
</script>

<style scoped>
.page-container {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.page-title {
  font-size: 18px;
  font-weight: bold;
  color: #1a1a2e;
}
</style>
