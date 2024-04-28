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
          <DSList :objects="objectList.values"
                  :title="objectList.title"
                  @selected="objectList.selected = $event; description = $event.text"/>
          <DatabaseObject
              :objects="[{action: 'text'}]"
              :show="true"
              title="Название"
              @update:selected="selectObject"
          />
          <DatabaseObject
              :objects="document.values"
              :show="true"
              title="Документ"
              @update:selected="selectDocument"
          />
          <div class="modal-header">
            <div class="modal-title">Описание дополнительного соглашения:</div>
          </div>
          <div>
            <textarea id="" v-model="description" cols="30" name="" rows="10"></textarea>
          </div>
        </div>
        <div class="filter__item" @click="createModal">
          создать
        </div>
      </SubModal>
    </div>
  </div>
</template>

<script>
import UploadApi from "@/api/UploadApi";
import DSList from "@/Blocks/DSList.vue";
import DatabaseObject from "@/Blocks/DatabaseCreate/DatabaseObject.vue";
import DsApi from "@/api/DsApi";

export default {
  name: 'construct-create',
  props: {
    title: String,
    contractId: String,
    // showSubModal: Boolean,
  },
  components: {DatabaseObject, DSList},
  emits: ['update:isVisible', 'add-contracts', 'selected'],
  data() {
    return {
      showSubModal: false,
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
    createModal() {
      console.log(this.documentFile)
      DsApi.create({name: this.name, description: this.description, document: this.documentFile}).then((response) => {
        this.selectedObject = response.data;
        this.$emit('selected', response.data);
      })
    },
    closeCreate() {
      this.showSubModal = false;
      // this.$emit()
    },
    subModal() {
      this.showSubModal = true;
    },
    selectObject(event) {
      this.name = event.name;
    },
    selectDocument(event) {
      UploadApi.upload(event).then((response) => {
        this.documentFile = response.data.fileName;
      });
    }
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
</style>