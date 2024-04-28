<template>
  <Modal v-model:isVisible="modalVisible">
    <div class="modal-close" @click="closeCreate"><img alt="" src="../assets/icons/cancel.png"></div>
    <div class="modal__content-title">Пожалуйста выберите:</div>
    <Object v-if="!exist"
            :objects="objectList.values"
            :title="objectList.title"
            @selected="objectList.selected = $event"/>
    <ClientsObjectList
        :objects="clientList.values"
        :title="clientList.title"
        @selected="clientList.selected = $event"/>
    <DatabaseObject v-for="(object, index) in databaseObjects"
                    :key="index"
                    :objects="object.values"
                    :title="object.title"
                    @objectSelect="selectedObject($event)"
                    @update:selected="object.selected = $event"
                    @update:objects="object.values = $event"
    />
  </Modal>
</template>

<script>
import Object from './AffairsCreate/Object.vue';
import DatabaseObject from "@/Blocks/DatabaseCreate/DatabaseObject.vue";
import DocumentsApi from "@/api/DocumentsApi";
import UploadApi from "@/api/UploadApi";
import ClientsObjectList from "@/Blocks/ClientsObjectList.vue";

export default {
  name: 'construct-create',
  props: {
    show: Boolean,
    exist: Boolean,
  },
  components: {ClientsObjectList, DatabaseObject, Object},
  emits: ['update:isVisible', 'add-contracts'],
  data() {
    return {
      modalVisible: false,
      objectList: {},
      databaseObjects: {},
      clientList: {}
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
    async allObjectsSelected(newVal) {
      if (newVal.selected) {
        if (newVal.data.document.name.split('.').length > 1) {
          newVal.data.document = (await UploadApi.upload(newVal.data.document)).data.fileName;
        }
        const object = this.exist ? this.$route.params.id : this.objectList.selected?.id;
        DocumentsApi.create({...newVal.data, object}).then((contract) => {
          if (contract.data.id !== undefined) {
            this.$emit('add-contracts', contract.data)
            this.constructorModal();
            this.modalVisible = false;
          }
        });
      }
    },
  },
  methods: {
    async constructorModal() {
      this.objectList = {
        title: 'обьект',
        values: [
          {name: 'ввести в ручную', action: 'insert'},
          {name: 'база данных РК', action: 'objectList'}
        ],
        selected: {}
      };
      this.clientList = {
        title: 'Заявитель',
        values: [
          {name: 'ввести в ручную', action: 'insert'},
          {name: 'существующие клиенты', action: 'objectList'}
        ],
        selected: {}
      }
      this.databaseObjects = {
        number: {
          title: 'Номер',
          values: [
            {name: 'генерируется автоматически'}
          ],
          selected: ''
        },
        status: {
          title: 'Статус',
          values: [
            {action: 'text'}
          ],
          selected: ''
        },
        lang: {
          title: 'Языки',
          values: [
            {action: 'text'},
          ],
          selected: ''
        },
        deadline: {
          title: 'Cроки',
          values: [
            {action: 'date'}
          ],
          selected: ''
        },
        document: {
          title: 'доверенность',
          values: [
            {name: 'файл', action: 'file'},
          ],
          selected: ''
        },
      };
    },
    closeCreate() {
      this.modalVisible = false;
    },
    selectedObject(event) {
      this.objectList.selected = event;
    }
  },
  computed: {
    allObjectsSelected() {
      const data = {};
      let allFilled = true;

      for (const key in this.databaseObjects) {
        const object = this.databaseObjects[key];

        if (object.selected === '' || object.selected === undefined ||
            this.objectList.selected === '' || this.objectList.selected === undefined ||
            this.clientList.selected === '' || this.clientList.selected === undefined) {
          allFilled = false;
          break;
        } else {
          data[key] = object.selected.id ? object.selected.id : object.selected.name;
          data[key] = data[key].split('.').length > 1 ? object.selected : data[key];
        }
      }

      return {
        selected: allFilled,
        data: allFilled ? data : {},
      };
    }
  },
}
</script>