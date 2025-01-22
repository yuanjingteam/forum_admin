<script lang="ts" setup>
import {
  PropType,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  watch
} from 'vue';
import { ISpec } from '@visactor/vchart';
import VChart from '@visactor/vchart';

const props = defineProps({
  options: {
    type: Object as PropType<ISpec>,
    default() {
      return {};
    }
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  }
});

let chart = null;
const chartRef = ref(null);

const initChart = () => {
  // 检查 chartRef 是否存在且 chart 尚未初始化，并且 props.options 也可用
  if (chartRef.value && !chart && props.options) {
    // 使用 props.options 和 chartRef.value 创建新的 VChart 实例
    chart = new VChart(props.options, { dom: chartRef.value });
    // 同步渲染图表
    chart.renderSync();
  } else {
    // 如果条件不满足，释放已存在的图表资源
    releaseChart();
  }
};

const updateChart = () => {
  if (chart) {
    chart.updateSpec(props.options);
    chart.renderSync();
  } else {
    initChart();
  }
};

const releaseChart = () => {
  if (chart) {
    chart.release();
    chart = null;
  }
};

watch(
  () => props.options,
  () => {
    updateChart();
  }
);

onMounted(() => initChart());
onUpdated(() => updateChart());
onBeforeUnmount(() => releaseChart());
</script>

<template>
  <div ref="chartRef" :style="{ width, height }" />
</template>
