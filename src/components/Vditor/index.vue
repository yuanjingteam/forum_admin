<script setup lang="ts">
import { ref, onMounted } from 'vue';
import 'vditor/dist/index.css'; // 引入样式
import Vditor from 'vditor'; // 引入 Vditor
import { getArticleDetail } from '@/api/article';

const props = defineProps({
  id: {
    type: Number,
    required: true
  }
});

const previewElement = ref(null);

onMounted(async () => {
  const { data } = await getArticleDetail(props.id);
  const markdownContent = data.article.content;

  // 渲染 Markdown
  Vditor.preview(previewElement.value, markdownContent, {
    mode: 'light', // 主题模式
    anchor: 1, // 在标题前添加锚点
    after: () => {
      console.log('渲染完成');
    }
  });
});

// onMounted(() => {
//   const markdownContent = `
// # Hello, Vditor!
// 这是一些 **Markdown** 文本，包含 *斜体* 和 [链接](https://ld246.com)。

// \`\`\`javascript
// console.log("Hello, world!");
// \`\`\`
//   `;

// });
</script>

<template>
  <!-- <div ref="editorRef"></div> -->
  <div ref="previewElement" class="markdown-preview"></div>
</template>

<style>
.markdown-preview {
  padding: 20px;
  border: 1px solid #eaeaea; /* 可选样式 */
  border-radius: 4px; /* 可选样式 */
}
</style>
