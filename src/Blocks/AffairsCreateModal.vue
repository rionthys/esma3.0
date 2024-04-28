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
  </Modal>
</template>

<script>
import Object from './AffairsCreate/Object.vue';
import DatabaseObject from "@/Blocks/DatabaseCreate/DatabaseObject.vue";
import AffairsApi from "@/api/AffairsApi";
import UsersApi from "@/api/UsersApi";

export default {
  name: 'affairs-create',
  props: {
    show: Boolean,
    exist: Boolean,
  },
  components: {DatabaseObject, Object},
  emits: ['update:isVisible', 'add-affairs'],
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
        const object = this.exist ? this.$route.params.id : this.objectList.selected?.id;
        AffairsApi.create({...newVal.data, object}).then((affair) => {
          if (affair.data.id !== undefined) {
            this.$emit('add-affairs', affair.data)
            this.constructorModal();
            this.modalVisible = false;
          }
        });
      }
    },
  },
  methods: {
    async constructorModal() {
      const users = await UsersApi.get();
      this.objectList = {
        title: 'обьект',
        values: [
          {name: 'ввести в ручную', action: 'insert'},
          {name: 'база данных РК', action: 'objectList'}
        ],
        selected: {}
      };
      this.databaseObjects = {
        name: {
          title: 'Название дела',
          values: [
            {action: 'text'},
          ],
          selected: ''
        },
        view: {
          title: 'вид',
          values: [
            {name: 'продление срока действия ТЗ'},
            {name: 'новая заявка на тз'},
            {name: 'письмо-согласие'},
            {name: 'преодоление отказа'}
          ],
          selected: ''
        },
        number: {
          title: 'номер',
          values: [
            {name: 'генерируется автоматически'}
          ],
          selected: ''
        },
        status: {
          title: 'cтатус',
          values: [
            {action: 'text'},
          ],
          selected: ''
        },
        deadline: {
          title: 'сроки',
          values: [
            {action: 'date'}
          ],
          selected: ''
        },
        subscriber: {
          title: 'подписант',
          values: users.data,
          selected: ''
        },
        responsible: {
          title: 'исполнитель',
          values: users.data,
          selected: ''
        },
        attention: {
          title: 'вниманию',
          values: [
            {action: 'text'},
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