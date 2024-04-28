<template>
  <SubModal v-model:isVisible="modalVisible">
    <div class="modal-close" @click="closeCreate"><img alt="" src="../assets/icons/cancel.png"></div>
    <div class="modal__content-title">Пожалуйста выберите:</div>
    <ClientsObjectList
        :objects="objectList.values"
        :title="objectList.title"
        @selected="objectList.selected = $event"/>
    <DatabaseObject v-for="(object, index) in databaseObjects"
                    :key="index"
                    :objects="object.values"
                    :title="object.title"
                    @update:selected="updateSelected(object, $event)"
                    @update:objects="object.values = $event"/>
  </SubModal>
</template>

<script>
import DatabaseObject from './DatabaseCreate/DatabaseObject.vue';
import DatabaseObjectApi from '../api/DatabaseObjectApi';
import UploadApi from "@/api/UploadApi";
import ClientsObjectList from "@/Blocks/ClientsObjectList.vue";
import updateObject from "@/Blocks/UpdateObject.vue";

export default {
  name: 'affairs-create',
  props: {
    show: Boolean,
  },
  components: {ClientsObjectList, DatabaseObject},
  emits: ['update:isVisible'],
  data() {
    return {
      modalVisible: false,
      objectList: {},
      databaseObjects: {}
    }
  },
  mounted() {
    this.modalVisible = this.show;
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
  computed: {
    updateObject() {
      return updateObject
    },
    allSelectedFilled() {
      const data = {};
      let allFilled = true;

      for (const key in this.databaseObjects) {
        const object = this.databaseObjects[key];

        if (object.selected === '' || object.selected === undefined) {
          allFilled = false;
          break;
        } else if (object.selected.name.split('.').length > 1) {
          data[key] = object.selected;
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
  methods: {
    closeCreate() {
      this.modalVisible = false;
    },
    updateSelected(object, event) {
      object.selected = event
      this.updateAllSelectedFilled();
    },
    async updateAllSelectedFilled() {
      let allSelected = this.allSelectedFilled;
      console.log(this.allSelectedFilled)
      if (allSelected.selected) {
        if (allSelected.data.trademark.name.split('.').length > 1) {
          allSelected.data.trademark = (await UploadApi.upload(allSelected.data.trademark)).data.fileName;
        }
        if (this.objectList.selected) {
          allSelected.data.client = this.objectList.selected.id;
          console.log(this.objectList.selected.id)
        }
        const object = await DatabaseObjectApi.create(allSelected.data);
        if (object.data.id !== undefined) {
          this.$emit('update:objectSelect', object.data);
        }
      }
    },
    async constructorModal() {
      this.objectList = {
        title: 'клиент',
        values: [
          {name: 'ввести в ручную', action: 'insert'},
          {name: 'существующие клиенты', action: 'objectList'}
        ],
        selected: {}
      }
      this.databaseObjects = {
        name: {
          title: 'Название объекта',
          values: [
            {action: 'text'},
          ],
          selected: ''
        },
        trademark: {
          title: 'Товарный знак',
          values: [
            {name: 'Файл', action: 'file', options: false},
          ],
          selected: ''
        },
        trademarkType: {
          title: 'Тип товарного знака',
          values: [
            {name: 'Словесные'},
            {name: 'Изобразительные'},
            {name: 'Комбинированные'},
          ],
          selected: ''
        },
        territory: {
          title: 'Территория',
          values: [
            {name: 'Казахстан (KZ)'},
            {name: 'Россия (RU)'},
            {name: 'Европа (EU)'},
          ],
          selected: ''
        },
        nonProtectedElements: {
          title: 'Неохраноспособные элементы',
          values: [
            {action: 'text'},
          ],
          selected: ''
        },
        numberOrder: {
          title: 'Номер заявки',
          values: [
            {action: 'text'},
          ],
          selected: ''
        },
        dateOrder: {
          title: 'Дата заявки',
          values: [
            {action: 'date', options: false},
          ],
          selected: ''
        },
        numberRegistration: {
          title: 'Номер регистрации',
          values: [
            {action: 'text'},
          ],
          selected: ''
        },
        dateRegistration: {
          title: 'Дата регистрации',
          values: [
            {action: 'date', options: false},
          ],
          selected: ''
        },
        datePublication: {
          title: 'Дата публикации',
          values: [
            {action: 'date', options: false},
          ],
          selected: ''
        },
        priorityNumber: {
          title: 'Номер приоритета',
          values: [
            {action: 'text'},
          ],
          selected: ''
        },
        priorityDate1: {
          title: 'Дата приоритета',
          values: [
            {action: 'date', options: false},
          ],
          selected: ''
        },
        validityStart: {
          title: 'Начало срока действия',
          values: [
            {action: 'date', options: false},
          ],
          selected: ''
        },
        validityEnd: {
          title: 'Конец срока действия',
          values: [
            {action: 'date', options: false},
          ],
          selected: ''
        },
        extensionStart: {
          title: 'Начало срока продления',
          values: [
            {action: 'date', options: false},
          ],
          selected: ''
        },
        extensionEnd: {
          title: 'Конец срока продления',
          values: [
            {action: 'date', options: false},
          ],
          selected: ''
        },
        niceClasses: {
          title: 'Классы МКТУ',
          values: [
            {action: 'text'},
          ],
          selected: ''
        },
      }
    }
  },
  closeCreate() {
    this.modalVisible = false;
  },
}
</script>   