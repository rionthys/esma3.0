<template>
  <div style="position: relative">
    <div v-if="isVisible" class="sub-modal-overlay">
      <div class="modal-window">
        <slot></slot>
      </div>
    </div>
    <div v-if="isVisible" class="overlay" @click.self="closeModal">
    </div>
  </div>
</template>

<script>
export default {
  name: 'sub-modal',
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
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.sub-modal-overlay {
  position: fixed;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.modal-window {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  top: 0;
  position: absolute;
  width: max-content;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, .8);
}
</style>
