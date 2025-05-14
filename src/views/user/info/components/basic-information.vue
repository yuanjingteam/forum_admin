<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import { BasicInfoModel } from '@/api/user-center';
import { getPersonalInfo, updatePersonalInfo } from '@/api/user-center';
const formRef = ref<FormInstance>();
const formData = ref<BasicInfoModel>({
  id: 0,
  nickname: '',
  career_direction: '',
  user_home_page: '',
  user_signature: '',
  path: '',
  user_tags: [],
  all_tag_names: []
});
const validate = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    // 保存用户信息
    await updatePersonalInfo(formData.value);
  }
};

const PersonalInfo = async () => {
  // 获取用户个人信息
  const { data } = await getPersonalInfo(formData.value.id);
  formData.value = data.data as BasicInfoModel;
  console.log(formData.value, 222222222222);
};
onMounted(() => {
  //
  PersonalInfo();
});
const reset = async () => {
  await formRef.value?.resetFields();
};
</script>

<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
    <a-form-item
      field="nickname"
      label="昵称"
      :rules="[
        {
          required: true,
          message: '请输入昵称'
        }
      ]"
    >
      <a-input v-model="formData.nickname" placeholder="请输入您的昵称" />
    </a-form-item>
    <a-form-item
      field="career_direction"
      label="职业方向"
      :rules="[
        {
          required: true,
          message: '请输入职业方向'
        }
      ]"
    >
      <a-input
        v-model="formData.career_direction"
        placeholder="请输入您的职业方向"
      />
    </a-form-item>

    <a-form-item
      field="user_signature"
      label="个性签名"
      :rules="[
        {
          required: true,
          message: '请输入个性签名'
        }
      ]"
    >
      <a-input
        v-model="formData.user_signature"
        placeholder="请输入您的个性签名"
      />
    </a-form-item>

    <a-form-item
      field="profile"
      label="个人简介"
      :rules="[
        {
          maxLength: 200,
          message: '个人简介不能超过200字'
        }
      ]"
      row-class="keep-margin"
    >
      <a-textarea
        v-model="formData.user_home_page"
        placeholder="请您输入您的个人简介，最多不超过200字"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate">保存</a-button>
        <!-- <a-button type="secondary" @click="reset">重置</a-button> -->
      </a-space>
    </a-form-item>
  </a-form>
</template>

<style scoped lang="less">
.form {
  width: 540px;
  margin: 0 auto;
}
</style>
