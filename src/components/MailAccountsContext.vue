<template>
  <div v-if="visible" :style="{ top: `${position.y}px`, left: `${position.x}px` }" class="context-menu">
    <ul>
      <li v-if="rights.edit" @click="addCase">Отправить счет</li>
      <li @click="editCase">Просмотр счета</li>
      <li v-if="rights.delete" @click="deleteCase">Удалить счет</li>
    </ul>
  </div>
</template>

<script>
import UsersApi from "@/api/UsersApi";

export default {
  props: {
    visible: Boolean,
    position: {
      type: Object,
      default: () => ({x: 0, y: 0}),
    },
  },
  data() {
    return {
      rights: UsersApi.rights,
    }
  },
  methods: {
    addCase() {
      this.$emit('addCase');
    },
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
