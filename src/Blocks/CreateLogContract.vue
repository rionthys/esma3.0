<template>
  <Modal v-model:isVisible="modalVisible">
    <div class="modal-close" @click="closeCreate"><img alt="" src="../assets/icons/cancel.png"></div>
    <div class="modal__content-title">Пожалуйста выберите:</div>
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
import DatabaseObject from "@/Blocks/DatabaseCreate/DatabaseObject.vue";
import UploadApi from "@/api/UploadApi";
import UsersApi from "@/api/UsersApi";
import ContractsApi from "@/api/ContractsApi";

export default {
  name: 'contract-create',
  props: {
    show: Boolean,
    exist: Boolean,
  },
  components: {DatabaseObject},
  emits: ['update:isVisible', 'add-log'],
  data() {
    return {
      modalVisible: false,
      objectList: {},
      databaseObjects: {},
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
      this.$emit('add-log', newVal);
    },
    async allObjectsSelected(newVal) {
      if (newVal.selected) {
        if(newVal.data.document.name.split('.').length > 1) {
          newVal.data.document = [(await UploadApi.upload(newVal.data.document)).data.fileName];
        }
        ContractsApi.createLogs(this.$route.params.id, {...newVal.data, responsible: UsersApi.id}).then((affair) => {
          if (affair.data.id !== undefined) {
            this.$emit('add-log', affair.data)
            this.constructorModal();
            this.modalVisible = false;
          }
        });
      }
    },
  },
  methods: {
    async constructorModal() {
      this.databaseObjects = {
        type: {
          title: 'Тип действия',
          values: [
            {name: 'входящее'},
            {name: 'исходящее'},
            {name: 'переписка'},
          ],
          selected: ''
        },
        action: {
          title: 'действие',
          values: [
            {action: 'text'},
          ],
          selected: ''
        },
        document: {
          title: 'документ',
          values: [
            { name: 'файл', action:'file', options: false }
          ],
          selected: ''
        },
        status: {
          title: 'cтатус',
          values: [
            {action: 'text'},
          ],
          selected: ''
        }
      };
    },
    closeCreate() {
      this.$emit('add-log');
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

        if (object.selected === '' || object.selected === undefined) {
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