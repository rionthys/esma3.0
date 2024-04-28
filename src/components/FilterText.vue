<template>
  <div class="filter__row-container">
    <div class="filter-header">
      показывать:
    </div>
    <div v-for="item in items"
         :key="item"
         :class="{
             'filter__item-text': true,
           'active': selected.includes(item)
           }"
         @click="select(item)">
      {{ item.preview }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selected: [...this.items],
    };
  },
  methods: {
    select(item) {
      const isActive = this.selected.find((itm) => itm === item);

      if(isActive) {
        this.selected = this.selected.filter((itm) => itm !== item);
      } else {
        this.selected.push(item);
      }

      this.$emit('active', this.selected);
    },
  },
};
</script>


<style>
.filter__item-text::before {
  content: ' ';
  display: inline-block;
  margin-right: 0.5em;
  width: 1em;
  height: 1em;
}

.filter__item-text.active::before {
  content: '✔';
  display: inline-block;
  margin-right: 0.5em;
  color: #000;
}
</style>