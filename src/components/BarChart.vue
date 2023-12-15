<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const props = defineProps<{
  chartData: {
    labels: string[],
    data: number[]
  },
  chartOptions?: Record<string, any>
}>()
const chartColor = 'rgba(235, 235, 235, 0.64)'
const data = computed(
  () => ({
    labels: props.chartData.labels,
    datasets: [
      {
        label: '',
        backgroundColor: '#2c5de5',
        borderWidth: 1,
        borderColor: chartColor,
        data: props.chartData.data
      }
    ]
  })
)
const options = computed(
  () => {
    const defaultScaleSettings = {
      grid: {
        color: chartColor
      },
      border: {
        color: chartColor
      },
      ticks: {
        color: chartColor
      }
    }
    return {
      ...(props.chartOptions ?? {}),
      responsive: true,
      plugins: {
        legend: {
          display: false
        }

      },
      scales: {
        x: defaultScaleSettings,
        y: defaultScaleSettings
      }
    }
  }
)
</script>

<template>
  <Bar
    :options="options"
    :data="data"
    class="chart"
  />
</template>

<style scoped>
  .chart {
    max-height: 100%;
    position: relative
  }
</style>
