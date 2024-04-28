<template>
  <Modal v-model:isVisible="modalVisible">
    <div class="modal-close" @click="closeCreate"><img alt="" src="../assets/icons/cancel.png"></div>
    <div class="modal__content-title">Пожалуйста выберите:</div>
    <Object :objects="objectList.values" :title="objectList.title"/>
    <DatabaseObject v-for="(object, index) in databaseObjects"
                    :key="index"
                    :objects="object.values"
                    :title="object.title"
                    @update:selected="object.selected = $event"
                    @update:objects="object.values = $event"/>
  </Modal>
</template>

<script>
import Object from './AffairsCreate/Object.vue';
import DatabaseObject from "@/Blocks/DatabaseCreate/DatabaseObject.vue";

export default {
  name: 'mails-registry-create',
  props: {
    show: Boolean,
  },
  components: {DatabaseObject, Object },
  emits: ['update:isVisible'],
  data() {
    return {
      modalVisible: false,
      databaseObjects: {
        number: {
          title: 'трек-номер',
          values: [
            { action: 'text' },
          ],
          selected: ''
        },
        service: {
          title: 'служба',
          values: [
            { action: 'text' },
          ],
          selected: ''
        },
        date: {
          title: 'дата',
          values: [
            { action: 'date' },
          ],
          selected: ''
        },
        destination: {
          title: 'адресат',
          values: [
            { action: 'text' },
          ],
          selected: ''
        },
        сontent: {
          title: 'содержание',
          values: [
            { action: 'text' },
          ],
          selected: ''
        },
      },
    }
  },
  watch: {
    show(newVal) {
      this.modalVisible = newVal;
    },
    modalVisible(newVal) {
      this.$emit('update:show', newVal);
    }
  },
  methods: {
    closeCreate() {
      this.modalVisible = false;
    },
  },
}
</script>