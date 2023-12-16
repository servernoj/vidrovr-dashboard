<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAssetsStore } from '@/stores/assets'
import { ref, onMounted, computed } from 'vue'
import type { Asset, Person } from '@/types'
import { useSpinner } from '@/composables'
import BarChart from '@/components/BarChart.vue'
import PersonThumbnails from '@/components/PersonThumbnails.vue'

type ListStat = {
  name: string
  count: number
}[]
type ChartStat = {
    labels: string[]
    data: number[]
}
type PersonStat = {
  list: ListStat
  chartFull: ChartStat
  chartCompact: ChartStat
}
// -- composables
const { spinnerShow, spinnerHide, spinnerIsActive } = useSpinner()
const route = useRoute()
const assetsStore = useAssetsStore()
// -- state
// list of persons associated with the asset
const persons = ref<Person[]>([])
// flag controlls rendering of the video element
const isMediaLoaded = ref(false)
// number that should be exceeded by person's appearances count for that person to be included in the compact chart.
// when set to 0 activates full chart mode
const compactChartThreshold = ref(0)
// -- computed
const asset = computed<Asset|null>(
  () => {
    const assetId = Array.isArray(route.params.id) && route.params.id.length
      ? route.params.id[0]
      : route.params.id as string
    return assetsStore.assetsById[assetId] ?? null
  }
)
const personsStats = computed<PersonStat | null>(
  () => {
    if (!persons.value.length) {
      return null
    }
    const list = persons.value
      .map(
        p => ({
          name: p.name,
          count: p.appearances.length
        })
      )
      .slice()
      .sort(
        (a, b) => b.count - a.count
      )
    const chartFull = list.reduce(
      (acc, item) => {
        acc.labels.push(item.name)
        acc.data.push(item.count)
        return acc
      },
      {
        labels: [],
        data: []
      } as ChartStat
    )
    const chartCompact = list.reduce(
      (acc, item) => {
        if (item.count > compactChartThreshold.value) {
          acc.labels.push(item.name)
          acc.data.push(item.count)
        } else {
          acc.others += item.count
        }
        return acc
      },
      {
        labels: [],
        data: [],
        others: 0
      } as ChartStat & {others: number}
    )
    return {
      list,
      chartFull,
      chartCompact: {
        labels: [...chartCompact.labels, `others (<= ${compactChartThreshold.value})`],
        data: [...chartCompact.data, chartCompact.others]
      }
    }
  }
)
const personsSorted = computed<Person[]>(
  () => {
    return persons.value.slice().sort(
      (a, b) => b.appearances.length - a.appearances.length
    )
  }
)
// -- lifecycle
onMounted(
  async () => {
    spinnerShow()
    if (!assetsStore.assets.length) {
      await assetsStore.retrieveAssets()
    }
    if (asset.value) {
      persons.value = await assetsStore.retrievePersons(asset.value.id)
    }
    spinnerHide()
  }
)

</script>

<template>
  <div v-if="!spinnerIsActive" class="content">
    <template v-if="asset && personsStats">
      <h1 class="page-title">
        {{ asset.title }}
      </h1>
      <section class="media">
        <template v-if="asset.fps">
          <video v-show="isMediaLoaded" controls preload="metadata" @loadedmetadata="isMediaLoaded = true">
            <source :src="asset.media_url" :type="asset.mime_type">
            <p>
              Sorry, your browser doesn't support embedded videos. You can
              <a :href="asset.media_url">download it</a>
              and watch it offline
            </p>
          </video>
        </template>
        <img v-else :src="asset.media_url">
      </section>
      <section v-if="isMediaLoaded && personsStats.list.length" class="summary">
        <h2 class="summary-title">
          Persons appearances
        </h2>
        <div class="summary-item list">
          <ul class="items">
            <li v-for="s,idx in personsStats.list" :key="idx" class="item">
              <section class="item__name">
                {{ s.name }}
              </section>
              <section class="item__count">
                {{ s.count }}
              </section>
            </li>
          </ul>
        </div>
        <div class="summary-item chart">
          <BarChart :chart-data="!compactChartThreshold ? personsStats.chartFull : personsStats.chartCompact">
            Chart couldn't be loaded
          </BarChart>
        </div>
      </section>
      <section v-if="isMediaLoaded && asset.fps && persons.length" class="thumbnails">
        <h2 class="thumbnails-title">
          Video thumbnails
        </h2>
        <PersonThumbnails
          v-for="person,idx in personsSorted"
          :key="idx"
          :name="person.name"
          :appearances="person.appearances"
          :total-clip-time="asset.duration"
        />
      </section>
    </template>
    <h2 v-else>
      Asset not found
    </h2>
  </div>
</template>

<style scoped lang="scss">
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  gap: 2em;
  .page-title {
    font-weight: bold;
  }
  .media {
    width: 75%;
    & > * {
      width: 100%;
    }
  }
  .summary {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: flex-start;
    .summary-title {
      width: 100%;
      text-align: center;
      margin: 1em 0;
      font-weight: bold;
    }
    .summary-item {
      height: 50vh;
      max-height: 400px;
    }
    .list {
      flex: 2 0 0;
      .items {
        list-style: none;
        height: 100%;
        overflow-y: auto;
        .item {
          display: flex;
          padding: 0.5em;
          gap: 2em;
          &__name {
            flex: 1 0 0;
          }
          &__count {
            flex-basis: 50px;
            text-align: center;
          }
          border-bottom: 1px solid;
        }
      }
    }
    .chart {
      margin-top: 1em;
      margin-left: 2em;
      flex: 3 0 0;
      height: 100%;
      max-width: 70vw;
    }
  }
  .thumbnails {
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    .thumbnails-title {
      text-align: center;
      font-weight: bold;
    }
  }
}
</style>
