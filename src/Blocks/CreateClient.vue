<template>
  <div class="modal-close" @click="closeCreate"><img alt="" src="../assets/icons/cancel.png"></div>
  <div class="modal-header">
    <div class="modal-title">ввести в ручную:</div>
    <div @click="subModal">(выбрать)</div>
  </div>
  <SubModal v-model:isVisible="modalVisible">
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
import ClientsApi from "@/api/ClientsApi";
import updateObject from "@/Blocks/UpdateObject.vue";

export default {
  name: 'affairs-create',
  components: {DatabaseObject},
  emits: ['update:isVisible'],
  data() {
    return {
      modalVisible: false,
      objectList: {},
      databaseObjects: {},
      count: 0
    }
  },
  mounted() {
    this.constructorModal();
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
    subModal() {
      console.log(123);
      this.modalVisible = true;
    },
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
      if (this.count === 0) {
        if (allSelected.selected) {
          const object = await ClientsApi.create(allSelected.data);
          if (object.data.id !== undefined) {
            this.$emit('update:objectSelect', object.data);
          }
        }
      }

      this.count++
      setTimeout(() => this.count = 0, 1500);
    },
    async constructorModal() {
      this.databaseObjects = {
        name: {
          title: 'Название',
          values: [
            {action: 'text'}
          ],
          selected: ''
        },
        address: {
          title: 'Адресс',
          values: [
            {action: 'text'}
          ],
          selected: ''
        },
        bin: {
          title: 'БИН',
          values: [
            {action: 'text'}
          ],
          selected: ''
        },
        inn: {
          title: 'ИНН',
          values: [
            {action: 'text'}
          ],
          selected: ''
        },
        orgn: {
          title: 'ОРГН',
          values: [
            {action: 'text'}
          ],
          selected: ''
        },
      };
    }
  },
  closeCreate() {
    this.modalVisible = false;
  },
}
</script>