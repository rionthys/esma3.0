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
import AffairsApi from "@/api/AffairsApi";
import UsersApi from "@/api/UsersApi";
import MailsRegisteryApi from "@/api/MailsRegisteryApi";

export default {
  name: 'construct-create',
  props: {
    show: Boolean,
    exist: Boolean,
  },
  components: {DatabaseObject},
  emits: ['update:isVisible', 'add-mail'],
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
      this.$emit('update:show', newVal);
    },
    async allObjectsSelected(newVal) {
      if (newVal.selected) {
        MailsRegisteryApi.create({...newVal.data, responsible: UsersApi.id}).then((mail) => {
          if (mail.data.id !== undefined) {
            this.$emit('add-mail', mail.data)
            this.constructorModal();
            this.modalVisible = false;
          }
        });
      }
    },
  },
  methods: {
    async constructorModal() {
      const response = await AffairsApi.get();
      const affairs = response.data.map((affair) => {
        return {
          id: affair.id,
          name: affair.name ? affair.name : affair.number
        }
      });
      this.databaseObjects = {
        affairId: {
          title: 'дело',
          values: affairs,
          selected: ''
        },
        type: {
          title: 'Тип письма',
          values: [
            {name: 'входящее'},
            {name: 'исходящее'},
            {name: 'переписка'},
          ],
          selected: ''
        },
        number: {
          title: 'Трек номер',
          values: [
            {action: 'text'}
          ],
          selected: ''
        },
        services: {
          title: 'Служба',
          values: [
            {action: 'text'}
          ],
          selected: ''
        },
        destination: {
          title: 'адресат',
          values: [
            {action: 'text'},
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
        date: {
          title: 'Дата',
          values: [
            {action: 'date'}
          ],
          selected: ''
        },
        content: {
          title: 'Описание',
          values: [
            {action: 'text'}
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

        if (object.selected === '' || object.selected === undefined) {
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