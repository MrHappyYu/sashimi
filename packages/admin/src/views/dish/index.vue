<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">菜品管理</span>
      <a-button type="primary" style="background: #c9a96e; border: none" @click="openAdd">
        <template #icon><PlusOutlined /></template>新增菜品
      </a-button>
    </div>

    <!-- 筛选 / Filter -->
    <a-space style="margin-bottom: 16px">
      <a-select
        v-model:value="filterCategoryId"
        placeholder="分类筛选"
        style="width: 150px"
        allow-clear
        @change="loadList"
      >
        <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">{{
          cat.name
        }}</a-select-option>
      </a-select>
      <a-input-search
        v-model:value="filterKeyword"
        placeholder="搜索菜品名"
        style="width: 200px"
        @search="loadList"
      />
    </a-space>

    <a-table
      :data-source="list"
      :columns="columns"
      :loading="loading"
      row-key="id"
      :pagination="{ pageSize: 10 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'price'">
          <span style="color: #e74c3c; font-weight: bold">¥{{ record.price }}</span>
          <span
            v-if="record.originalPrice"
            style="color: #bbb; text-decoration: line-through; font-size: 12px; margin-left: 6px"
          >
            ¥{{ record.originalPrice }}
          </span>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 1 ? 'green' : 'default'">
            {{ record.status === 1 ? '上架' : '下架' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'isRecommended'">
          <a-tag v-if="record.isRecommended === 1" color="gold">推荐</a-tag>
          <span v-else style="color: #ccc">-</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a style="color: #c9a96e" @click="openEdit(record)">编辑</a>
            <a-popconfirm title="确认删除该菜品？" @confirm="deleteItem(record.id)">
              <a style="color: #ff4d4f">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>

    <!-- 菜品表单弹窗 / Dish form modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑菜品' : '新增菜品'"
      :confirm-loading="saving"
      width="600px"
      @ok="handleSave"
      @cancel="formRef?.resetFields()"
    >
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="菜品名称" name="name">
              <a-input v-model:value="form.name" placeholder="如：挪威三文鱼刺身" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属分类" name="categoryId">
              <a-select v-model:value="form.categoryId" placeholder="选择分类">
                <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="菜品描述" name="description">
          <a-textarea
            v-model:value="form.description"
            placeholder="描述菜品特点、份量等"
            :rows="2"
          />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="售价(¥)" name="price">
              <a-input-number
                v-model:value="form.price"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="原价(¥，可选)" name="originalPrice">
              <a-input-number
                v-model:value="form.originalPrice"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="图片URL（可选）" name="image">
          <a-input v-model:value="form.image" placeholder="菜品图片链接" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="排序" name="sort">
              <a-input-number v-model:value="form.sort" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="上架状态" name="status">
              <a-select v-model:value="form.status">
                <a-select-option :value="1">上架</a-select-option>
                <a-select-option :value="0">下架</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否推荐" name="isRecommended">
              <a-select v-model:value="form.isRecommended">
                <a-select-option :value="1">推荐</a-select-option>
                <a-select-option :value="0">不推荐</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { message, type FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { PlusOutlined } from '@ant-design/icons-vue'
import {
  getDishList,
  createDish,
  updateDish,
  deleteDish,
  type Dish,
  type DishForm,
} from '@/api/dish'
import { getCategoryList, type Category } from '@/api/category'

const list = ref<Dish[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const saving = ref(false)
const modalVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const filterCategoryId = ref<number | undefined>(undefined)
const filterKeyword = ref('')

const rules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, type: 'number', message: '请输入售价', trigger: 'change' }],
}

const form = reactive<DishForm>({
  id: null,
  name: '',
  categoryId: null as unknown as number,
  description: '',
  price: null as unknown as number,
  originalPrice: undefined,
  image: '',
  sort: 0,
  status: 1,
  isRecommended: 0,
})

const columns = [
  { title: 'ID', dataIndex: 'id', width: 70 },
  { title: '菜品名称', dataIndex: 'name' },
  { title: '分类', dataIndex: 'categoryName', width: 120 },
  { title: '价格', key: 'price', width: 150 },
  { title: '推荐', key: 'isRecommended', width: 80 },
  { title: '状态', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 120 },
]

async function loadCategories() {
  try {
    categories.value = await getCategoryList()
  } catch (e) {
    console.error(e)
  }
}

async function loadList() {
  loading.value = true
  try {
    list.value = await getDishList({
      categoryId: filterCategoryId.value,
      keyword: filterKeyword.value || undefined,
    })
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openAdd() {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    name: '',
    categoryId: null,
    description: '',
    price: null,
    originalPrice: null,
    image: '',
    sort: 0,
    status: 1,
    isRecommended: 0,
  })
  modalVisible.value = true
}

function openEdit(record: any) {
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
      await updateDish(form)
    } else {
      await createDish(form)
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
    await deleteDish(id)
    message.success('删除成功')
    loadList()
  } catch (e: any) {
    const msg = typeof e === 'string' ? e : e?.message || '删除失败'
    message.error(msg)
  }
}

onMounted(() => {
  loadCategories()
  loadList()
})
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
