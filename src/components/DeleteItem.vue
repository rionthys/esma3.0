<template>
  <div v-if="visible" :style="{ top: `${position.y}px`, left: `${position.x}px` }" class="context-menu">
    <ul>
      <li @click="editCase">Редактировать {{ entity }}</li>
      <li @click="deleteCase">Удалить {{ entity }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    entity: String,
    position: {
      type: Object,
      default: () => ({x: 0, y: 0}),
    },
  },
  methods: {
    deleteCase() {
      this.$emit('deleteCase');
    },
    editCase() {
      this.$emit('editCase')
    }
  },
};
</script>

<style>
.context-menu {
  position: fixed;
  z-index: 1000;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.context-menu ul {
  list-style: none;
  padding: 10px 0;
  margin: 0;
}

.context-menu ul li {
  padding: 10px 15px;
  cursor: pointer;
}

.context-menu ul li:hover {
  background-color: #f0f0f0;
}
</style>
