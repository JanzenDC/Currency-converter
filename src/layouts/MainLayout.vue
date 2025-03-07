<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          CC
        </q-toolbar-title>
        <q-space />
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
import { ref, onMounted } from 'vue';

const currentDateTime = ref('');

const updateDateTime = () => {
  const now = new Date();
  currentDateTime.value = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

onMounted(() => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
</script>
