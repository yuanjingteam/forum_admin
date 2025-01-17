<template>
  <div class="avatar-upload-wrapper">
    <!-- {{ modelValue }} -->

    <div
      :class="['avatar-box', { 'avatar-box-border': imgUrl ? false : true }]"
      :style="{ width: size + 'px', height: size + 'px' }"
      @click="clickAvatarBox"
    >
      <!-- 隐藏的input的type=file -->
      <input
        ref="fileInputRef"
        type="file"
        hidden
        accept="image/x-png,image/gif,image/jpeg,image/bmp"
        @change="changeFile"
      />

      <img v-if="imgUrl" :src="imgUrl" alt="" />

      <div v-else class="avatar-marker"><icon-plus /></div>
    </div>
  </div>
</template>

<script setup>
import request from '@/api/interceptor';
import { ref, reactive, watch } from 'vue';
const emits = defineEmits(['update:modelValue']);
const props = defineProps({
  size: {
    type: Number,
    default: 64
  },
  modelValue: {
    type: String,
    default: '' // 默认头像链接地址
  },
  maxSize: {
    type: Number,
    default: 5 // 默认最大不超过5M
  },
  serverUrl: {
    type: String,
    default: 'http://192.168.10.7:8081'
  },
  ifTerser: {
    type: Boolean
  }
});
let width = '0';
const fileInputRef = ref(null);
// const imgUrl = ref('http://localhost:9091/static/img/avatar/3026520210706112210298.png')
const imgUrl = ref(props.modelValue);
// console.log(imgUrl.value);
// 监听头像url改变（打开弹框时, 传入的图片地址变化时, 同步修改imgUrl）
watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    imgUrl.value = newVal;
  }
);

function clickAvatarBox() {
  fileInputRef.value.click();
}

function changeFile() {
  // 获取更改后的文件
  let file = fileInputRef.value.files[0];
  // 校验文件大小
  if (file.size / 1024 / 1024 > props.maxsize) {
    Message.error('文件超过指定大小');
  }
  // 执行文件上传
  let formData = new FormData();
  formData.append('files', file);
  if (props.ifTerser) {
    width = '200';
  }
  formData.append('width', width);

  let config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }; // 这个config可以不必携带, 当使用FormData传参时,
  // axios会自己带上'Content-Type': 'multipart/form-data',请求头

  request.post('/produce_image_url', formData, config).then(res => {
    console.log(res, '上传成功');
    imgUrl.value = res.data[0].url;
    let img = new Image();

    img.src = imgUrl.value;
    img.onload = () => {
      emits('update:modelValue', imgUrl.value);
    };
  });
}
</script>

<style lang="scss" scoped>
.avatar-box-border {
  border: 1px dashed #aeb0bb !important;
}

.avatar-box {
  margin-left: 20px;
  cursor: pointer;
  position: relative;
  border: 2px solid #eee;
  overflow: hidden;

  &:hover::before {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.03);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-marker {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aeb0bb;
  }
}
</style>
