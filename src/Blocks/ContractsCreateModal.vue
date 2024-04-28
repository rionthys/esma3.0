<template>
  <Modal v-model:isVisible="modalVisible">
    <div class="modal-close" @click="closeCreate"><img alt="" src="../assets/icons/cancel.png"></div>
    <div class="modal__content-title">Пожалуйста выберите:</div>
    <Object v-if="!exist"
            :objects="objectList.values"
            :title="objectList.title"
            @selected="objectList.selected = $event"/>
    <DatabaseObject v-for="(object, index) in databaseObjects"
                    :key="index"
                    :objects="object.values"
                    :title="object.title"
                    @objectSelect="selectedObject($event)"
                    @update:selected="object.selected = $event"
                    @update:objects="object.values = $event"
    />
    <DsCreateModal title="Дс"
                   @selected="ds.selected = $event;"/>
  </Modal>
</template>

<script>
import Object from './AffairsCreate/Object.vue';
import DatabaseObject from "@/Blocks/DatabaseCreate/DatabaseObject.vue";
import ContractsApi from "@/api/ContractsApi";
import DsCreateModal from '@/Blocks/DsCreateModal.vue';

export default {
  name: 'construct-create',
  props: {
    show: Boolean,
    exist: Boolean,
  },
  components: {DatabaseObject, Object, DsCreateModal},
  emits: ['update:isVisible', 'add-contracts'],
  data() {
    return {
      modalVisible: false,
      objectList: {},
      databaseObjects: {},
      ds: {
        title: "ДС",
        selected: {}
      }
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
    allObjectsSelected(newVal) {
      if (newVal.selected) {
        const object = this.exist ? this.$route.params.id : this.objectList.selected?.id;
        const ds = this.ds.selected.id;
        ContractsApi.create({...newVal.data, object, ds}).then((contract) => {
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
        deadline: {
          title: 'Cроки',
          values: [
            {action: 'date'}
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
            this.objectList.selected.id === '' || this.objectList.selected.id === undefined) {
          allFilled = false;
          break;
        } else {
          data[key] = object.selected.id ? object.selected.id : object.selected.name;
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