<script setup></script>

<template>
  <a-card class="general-card" title="查询表格">
    <a-row>
      <a-col :flex="1">
        <a-form
          :model="formModel"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
        >
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item field="number" label="集合编号">
                <a-input
                  v-model="formModel.number"
                  placeholder="请输入集合编号"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="name" label="名称">
                <a-input v-model="formModel.name" placeholder="请输入名称" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item>
                <a-button type="primary" @click="handleSearch">查询</a-button>
                <a-button @click="handleReset">重置</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
    </a-row>
    <a-table :data-source="comments" :columns="columns" row-key="id" />
  </a-card>
</template>
