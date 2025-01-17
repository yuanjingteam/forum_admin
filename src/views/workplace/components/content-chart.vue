<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      title="文章数据"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '10px'
      }"
    >
      <!-- <template #extra>
        <a-link>查看更多</a-link>
      </template> -->
      <VChart v-if="!loading" height="280px" :options="spec" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import useLoading from '@/hooks/useLoading';
// import { queryContentData } from '@/api/dashboard';
// import { IBarChartSpec } from '@visactor/vchart';
import { onMounted, ref } from 'vue';
import { getWorkplaceArticleSumService } from '@/api/workplace';

const spec: any = ref({
  type: 'bar',
  data: [
    {
      id: 'id0',
      values: []
    }
  ],
  xField: ['x'],
  yField: 'y',
  axes: [
    { orient: 'bottom', type: 'band' },
    { orient: 'left', type: 'linear' }
  ],
  animationNormal: {
    bar: [
      {
        loop: true,
        startTime: 100,
        oneByOne: 100,
        timeSlices: [
          {
            delay: 1000,
            effects: {
              channel: {
                fillOpacity: { to: 0.5 }
              },
              easing: 'linear'
            },
            duration: 500
          },
          {
            effects: {
              channel: {
                fillOpacity: { to: 1 }
              },
              easing: 'linear'
            },
            duration: 500
          }
        ]
      }
    ]
  }
});

const { loading, setLoading } = useLoading(true);
const fetchData = async () => {
  setLoading(true);
  const {
    data: { article_sum }
  } = await getWorkplaceArticleSumService();
  const presetData = article_sum;
  const getLineData = () => {
    const count = 14;
    return new Array(count).fill(0).map((_el, idx) => ({
      x: dayjs()
        .subtract(count - idx, 'day')
        .format('YYYY-MM-DD'),
      y: presetData[idx]
    }));
  };
  spec.value.data[0].values = getLineData();
  setLoading(false);
};

onMounted(() => fetchData());
</script>

<style scoped lang="less"></style>
