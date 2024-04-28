<template>
  <div class="nav">
    <!--    <div class="nav__arrow">-->
    <!--      <img :src="leftArrow" />-->
    <!--      <img :src="rightArrow" />-->
    <!--    </div>-->
    <div class="nav-menu">
      <div
          v-for="category in categories"
          :key="category.name"
          class="nav__item-img"
      >
        <router-link v-if="rights && rights[category.rightsKey]" :to="category.link"
        ><img :src="category.img"
        /></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import UsersApi from "@/api/UsersApi";
import {eventBus} from "@/events/eventBus";

export default {
  data() {
    return {
      rights: UsersApi.rights,
      leftArrow: this.$icons.leftArrow,
      rightArrow: this.$icons.rightArrow,
      categories: this.$categories,
      route: this.$route.path
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
  }
}
</script>
