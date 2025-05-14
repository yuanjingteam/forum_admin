<script lang="ts" setup>
// export default {
//   name: 'Error'
// };
</script>

<template>
  <div class="container">
    <Breadcrumb :items="['结果页', '失败页']" />
    <div class="wrapper">
      <a-result
        class="result"
        status="error"
        title="提交失败"
        subtitle="表单提交失败，请重试"
      >
        <template #extra>
          <a-space class="operation-wrap" :size="16">
            <a-button key="again" type="secondary">回到首页</a-button>
            <a-button key="back" type="primary">返回修改</a-button>
          </a-space>
        </template>
      </a-result>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  padding: 0 20px 20px;
}

.wrapper {
  padding: 24px 150px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

.result {
  margin: 150px 0 36px;
}

.operation-wrap {
  margin-bottom: 40px;
  text-align: center;
}
</style>
