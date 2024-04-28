<template>
  <div class="content__category-wrapper">
    <div
        v-for="(group, index) in groupedCategories"
        :key="'group-' + index"
        class="category__content-row"
    >
      <div
          v-for="category in group"
          :key="category.name"
          :class="['category__item', {'d-none': rights && !rights[category.rightsKey]}]"
      >
        <router-link :to="category.link">
          <div class="category__item-img">
            <img :alt="category.name" :src="category.img"/>
          </div>
          <div class="category__item-title">{{ category.name }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import UsersApi from "@/api/UsersApi";
import {eventBus} from "@/events/eventBus";

export default {
  name: 'categories-nav',
  data() {
    return {
      rights: UsersApi.rights,
      route: this.$route.path,
      categories: this.$categories,
    }
  },
  mounted() {
    eventBus.on('rightsUpdated', this.updateRights);
  },
  beforeUnmount() {
    eventBus.off('rightsUpdated', this.updateRights);
  },
  methods: {
    updateRights(newRights) {
      this.rights = newRights;
    }
  },
  computed: {
    groupedCategories() {
      const groupSize = 4
      return this.categories.reduce((acc, item, index) => {
        const groupIndex = Math.floor(index / groupSize)
        if (!acc[groupIndex]) {
          acc[groupIndex] = []
        }
        acc[groupIndex].push(item)
        return acc
      }, [])
    },
  },
}
</script>


<style scoped>
.d-none {
  display: none;
}
</style>
