<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-window">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-view',
  props: {
    isVisible: Boolean,
  },
  emits: ['update:isVisible'],
  methods: {
    closeModal() {
      this.$emit('update:isVisible', false);
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.modal-window {
  top: 100px;
  position: fixed;
  background-color: white;
  padding: 22px 27px;
  border-radius: 25px;
  min-width: 250px;
  box-shadow: 0px 0px 10px 0px rgba(75, 75, 75, 0.8);
}
</style>
  