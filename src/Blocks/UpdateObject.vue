<template>
  <Modal :isVisible="modalVisible">
    <div class="modal-close" @click="closeCreate"><img alt="" src="../assets/icons/cancel.png"></div>
    <div class="modal__content-title">Пожалуйста выберите:</div>
    <div v-for="affair in databaseObjects" :key="affair.id" @click="selected(affair)"> {{ affair.name }}</div>
  </Modal>
</template>

<script>
import AffairsApi from "@/api/AffairsApi";

export default {
  name: 'object-update',
  props: {
    show: Boolean,
    objectId: String
  },
  components: {},
  emits: ['selected'],
  data() {
    return {
      modalVisible: false,
      databaseObjects: {},
    }
  },
  mounted() {
    AffairsApi.get().then((response) => {
      this.databaseObjects = response.data.map((object) => {
        const name = object.name ? object.name : object.number;
        return {
          name,
          id: object.id,
        }
      })
    })
  },
  watch: {
    show(newVal) {
      this.modalVisible = newVal;
    },
    modalVisible(newVal) {
      this.$emit('update:show', newVal);
    },
  },
  methods: {
    closeCreate() {
      this.modalVisible = false;
    },
    selected(affair) {
      this.$emit('selected', affair)
    }
  },
}
</script>

<style scoped>

</style>