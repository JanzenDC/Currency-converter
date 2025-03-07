<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <!-- Random Flag on the Left Side -->
        <q-img :src="randomFlag" width="32px" height="24px" class="q-mr-md random-flag" />


        <q-toolbar-title style="margin-left: 30px;">
          CC
        </q-toolbar-title>
        <q-space />

        <q-select
          v-model="selectedRegion"
          :options="regions"
          label="Region"
          dense
          outlined
          options-dense
          emit-value
          map-options
          class="q-mr-md"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section avatar>
                <q-img :src="scope.opt.flag" width="24px" height="16px" />
              </q-item-section>
              <q-item-section>
                {{ scope.opt.label }}
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:selected>
            <q-img :src="selectedFlag" width="24px" height="16px" class="q-mr-sm" />
            {{ selectedRegion }}
          </template>
        </q-select>

        <!-- <q-select
          v-model="selectedFormat"
          :options="timeFormats"
          label="Time Format"
          dense
          outlined
          options-dense
          class="q-mr-md"
        /> -->

        <div class="q-mr-md text-caption">
          {{ currentDateTime }}
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const currentDateTime = ref('');
const selectedFormat = ref('long');
const selectedRegion = ref('US');

const regions = [
  { label: '🇺🇸 US (EST)', value: 'US', flag: 'https://flagcdn.com/w40/us.png', locale: 'en-US', timeZone: 'America/New_York' },
  { label: '🇬🇧 UK (GMT)', value: 'UK', flag: 'https://flagcdn.com/w40/gb.png', locale: 'en-GB', timeZone: 'Europe/London' },
  { label: '🇯🇵 Japan (JST)', value: 'JP', flag: 'https://flagcdn.com/w40/jp.png', locale: 'ja-JP', timeZone: 'Asia/Tokyo' },
  { label: '🇮🇳 India (IST)', value: 'IN', flag: 'https://flagcdn.com/w40/in.png', locale: 'en-IN', timeZone: 'Asia/Kolkata' },
  { label: '🇦🇺 Australia (AEST)', value: 'AU', flag: 'https://flagcdn.com/w40/au.png', locale: 'en-AU', timeZone: 'Australia/Sydney' }
];

// const timeFormats = [
//   { label: 'Long Format', value: 'long' },
//   { label: 'Short Format', value: 'short' },
//   { label: '24-Hour Format', value: '24hour' }
// ];

const selectedFlag = ref(regions.find(r => r.value === selectedRegion.value)?.flag || '');
const randomFlag = ref(regions[0].flag);

const updateDateTime = () => {
  const now = new Date();
  const region = regions.find(r => r.value === selectedRegion.value);

  if (!region) return;

  let options = { timeZone: region.timeZone };

  if (selectedFormat.value === 'long') {
    options = { ...options, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
  } else if (selectedFormat.value === 'short') {
    options = { ...options, month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
  } else if (selectedFormat.value === '24hour') {
    options = { ...options, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  }

  currentDateTime.value = new Intl.DateTimeFormat(region.locale, options).format(now);
  selectedFlag.value = region.flag;
};

const updateRandomFlag = () => {
  const randomIndex = Math.floor(Math.random() * regions.length);
  randomFlag.value = regions[randomIndex].flag;
};

watch([selectedFormat, selectedRegion], updateDateTime);

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
  setInterval(updateRandomFlag, 1000);
});
</script>

<style scoped>
.random-flag {
  position: absolute;
  left: 10px;
  top: 15px;
}
</style>
