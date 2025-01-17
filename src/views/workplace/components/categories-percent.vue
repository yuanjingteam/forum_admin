<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      title="文章标签占比"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{
        padding: '20px'
      }"
    >
      <VChart
        v-if="spec.data[0].values.length > 0"
        height="306px"
        :options="spec"
      />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import useLoading from '@/hooks/useLoading';
import { ISpec } from '@visactor/vchart';
import { getWorkplacePielistService } from '@/api/workplace';
import { onMounted, ref } from 'vue';

const { loading, setLoading } = useLoading();
//让spec是一个响应式的对象
const spec = ref<ISpec>({
  type: 'pie',
  data: [
    {
      id: 'id0',
      values: []
    }
  ],
  outerRadius: 0.8,
  innerRadius: 0.5,
  padAngle: 0.6,
  valueField: 'value',
  categoryField: 'type',
  pie: {
    style: {
      cornerRadius: 8,
      lineWidth: 0,
      strokeOpacity: 0.5
    },
    state: {
      hover: {
        lineWidth: 8,
        outerBorder: {
          distance: 0.5,
          stroke: '#fff'
        }
      },
      selected: {
        lineWidth: 10,
        outerBorder: {
          distance: 0.2,
          stroke: '#fff'
        }
      }
    }
  },
  legends: {
    visible: true,
    orient: 'bottom'
  },
  label: {
    visible: true
  },
  tooltip: {
    mark: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['value'] + '%'
        }
      ]
    }
  },
  indicator: {
    visible: true,
    trigger: 'select',
    title: {
      visible: true,
      style: {
        fontSize: 14,
        text: data => {
          if (data) {
            const value = data['type'];
            return value ? value : null;
          }
          return '内容量';
        }
      }
    },
    content: [
      {
        visible: true,
        style: {
          fontSize: 14,
          text: data => {
            if (data) {
              const value = data['value'];
              return value ? `${value}%` : null;
            }
            return null;
          }
        }
      }
    ]
  }
});

const fetchData = async () => {
  try {
    setLoading(true);
    const {
      data: { pie_list }
    } = await getWorkplacePielistService();
    spec.value.data[0].values = pie_list;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
onMounted(() => fetchData());
</script>
