<template>
  <q-page class="column items-center justify-evenly q-pa-xl">
    <q-inner-loading
      :showing="isFetchLoading"
      label="Fetching data..."
      label-style="font-size: 1.1em"
    />

    <q-list dark separator bordered>
      <q-item clickable v-ripple v-for="character in characters" :key="character.id">
        <q-item-section avatar>
          <q-avatar>
            <img :src="character.image" />
          </q-avatar>
        </q-item-section>

        <q-item-section>{{ character.name }}</q-item-section>

        <q-item-section side>
          <q-icon name="chevron_right" color="white" />
        </q-item-section>
      </q-item>
    </q-list>

    <div class="q-pa-md">
      <q-pagination
        v-model="currentPage"
        :max="maxPages"
        :max-pages="5"
        direction-links
        boundary-links
        icon-first="skip_previous"
        icon-last="skip_next"
        icon-prev="fast_rewind"
        icon-next="fast_forward"
        @update:model-value="updateCharacterListByPage"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { Character } from 'src/components/models';
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';

const characters = ref<Character[]>([]);
const currentPage = ref(1);
const maxPages = ref(2);
const isFetchLoading = ref(true);

const fetchCharacterData = async (filter?: string) => {
  try {
    const result = await api({
      method: 'POST',
      data: {
        query: `
          {
            characters(
              page: ${currentPage.value}
              ${filter ? ', filter: { name: ' + filter + '}' : ''}
            ) {
              results {
                id
                name
                status
                species
                type
                gender
                origin {
                  name
                }
                location {
                  name
                }
                image
                created
              }
              info {
                pages
              }
            }
          }
        `,
      },
    });

    characters.value = result.data.data.characters.results;
    maxPages.value = result.data.data.characters.info.pages;

    isFetchLoading.value = false;
  } catch (error) {
    console.log(error);
  }
};

const updateCharacterListByPage = async (page: number) => {
  isFetchLoading.value = true;
  currentPage.value = page;
  await fetchCharacterData();
};

onMounted(fetchCharacterData);
</script>
