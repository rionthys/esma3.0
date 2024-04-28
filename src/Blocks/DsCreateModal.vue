<template>
  <div class="modal__content-select">
    <div class="modal-body">
      <div class="modal-header">
        <div class="modal-title">{{ title }}:</div>
        <div @click="subModal">({{ selectedObject.name }})</div>
      </div>
      <SubModal v-model:isVisible="showSubModal">
        <div class="filter__content">
          <div class="modal__content-title">Пожалуйста выберите:</div>
          <div class="modal-close" @click="closeCreate"><img alt="" src="../assets/icons/cancel.png"></div>
          <div @click="selectObject({name: 'нет'})">нет</div>
          <NewDsModal title="Создать ДС"
                      @click="showInsertSubModalList = true" @selected="selectObject($event)"/>
        </div>
      </SubModal>
    </div>
  </div>
</template>

<script>
import NewDsModal from '@/Blocks/NewDsModal.vue'

export default {
  name: 'construct-create',
  props: {
    title: String,
    contractId: String,
  },
  components: {NewDsModal},
  emits: ['update:isVisible', 'add-contracts', 'selected'],
  data() {
    return {
      showSubModal: false,
      showInsertSubModalList: false,
      objectList: {},
      selectedObject: {
        name: 'выбрать',
        values: [],
        selected: {}
      },
      document: {},
      documentFile: {},
      name: '',
      description: '',
    }
  },
  mounted() {
    this.constructorModal();
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
    async constructorModal() {
      this.objectList = {
        title: 'существующий дс',
        values:
            [
              {name: 'отсутсвует'},
              {name: 'база данных РК', action: 'objectList'}
            ],
        selected:
            {}
      }

      this.document = {
        title: 'документ',
        values:
            [
              {name: 'файл', action: 'file', options: false}
            ],
        selected:
            {}
      }
    },
    subModal() {
      this.showSubModal = true;
    },
    closeCreate() {
      this.showSubModal = false;
    },
    selectObject(event) {
      this.showSubModal = false;
      this.selectedObject = event;
      this.$emit('selected', event);
    },
  },
}
</script>


<style scoped>
.filter__item {
  border-radius: 5px;
  width: 80px;
  text-align: center;
  font-size: 16px;
  border: 2px solid rgba(148, 148, 148, 0.25);
  line-height: 1.5;
  padding: 1px 10px;
  font-weight: 500;
  cursor: pointer;
  margin-left: auto;
  margin-top: 10px;
}

.modal-window {
  width: 245px;
}
</style>