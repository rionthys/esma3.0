<template>
  <div class="toggle">
    <div
        v-for="(item, index) in items"
        :key="index"
        :class="{
          'toggle__item': true,
        'toogle-filter': isFilter,
         'active': (`${item}_${index}` === toggleId) || allow}"
        @click="select(`${item}_${index}`, item)"
    >
      <div v-if="!isImg">{{ item }}</div>
      <img v-if="isImg" :src="item.src"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'toggle-button',
  props: {
    items: {
      type: Array,
      required: true,
    },
    isImg: {
      type: Boolean,
      default: false,
    },
    isFilter: {
      type: Boolean,
      default: false,
    },
    allowMultiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      toggleId: this.allowMultiple ? `${this.items[0]}_0` : `${this.items[0]}_0`,
      allow: false,
    }
  },
  mounted() {
    this.allow = this.allowMultiple;
  },
  methods: {
    select(id, item) {
      this.allow = false;
      this.toggleId = id;
      this.$emit('item-selected', item);
    },
  }
}

</script>
  