<template>
  <Modal v-model:isVisible="modalVisible">
    <div class="modal-close" @click="closeCreate"><img alt="" src="../assets/icons/cancel.png"></div>
    <div class="modal__content-title">Пожалуйста выберите:</div>
    <DatabaseObject
        :objects="databaseList"
        title="дела"
        @update:selected="selectObject($event)"
    />
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
import AccountsApi from "@/api/AccountsApi";
import AffairsApi from "@/api/AffairsApi";
import PriceListApi from "@/api/PriceListApi";

export default {
  name: 'accounts-create',
  props: {
    show: Boolean,
    exist: Boolean,
  },
  components: {DatabaseObject},
  emits: ['update:isVisible', 'add-affairs'],
  data() {
    return {
      modalVisible: false,
      objectList: {},
      databaseObjects: {},
      databaseList: [],
      selectedObjectAf: '',
      count: 0
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
        newVal.data.state = newVal.data.state === 'да';
        if (this.count === 0) {
          AccountsApi.create({...newVal.data, affair: this.selectedObjectAf.id}).then((affair) => {
            if (affair.data.id !== undefined) {
              this.$emit('add-affairs', affair.data)
              this.constructorModal();
              this.modalVisible = false;
            }
          });
        }
        this.count++
        setTimeout(() => this.count = 0, 1500);
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
      AffairsApi.get().then(
          (response) => {
            this.databaseList = response.data.map((affair) => {
              return {name: affair.name, id: affair.id}
            });
          }
      );

      const prices = [];
      const services = [];
      const response = (await PriceListApi.get()).data

      response.forEach((element, inx) => {
        const values = Object.entries(element.value).reverse();
        console.log(values);
        values.forEach((val, index) => {
          if (index !== 0 && index !== 1 && index !== 2 && inx === 0) {
            prices.push({name: val[0]})
          } else if (index === 0) {
            services.push({name: val[1]})
          }
        })
      })


      console.log(services);

      this.databaseObjects = {
        type: {
          title: 'Использумая валюта',
          values: prices,
          selected: ''
        },
        service: {
          title: 'Действие',
          values: services,
          selected: ''
        },
        state: {
          title: 'Оплачен',
          values: [
            {name: 'да'},
            {name: 'нет'},
          ],
          selected: ''
        },
        status: {
          title: 'Тип гос. пошлины',
          values: [
            {name: 'юр. лицо'},
            {name: 'физ. лицо'},
          ],
          selected: ''
        },
        date: {
          title: 'Дата',
          values: [
            {action: 'date'}
          ],
          selected: ''
        }
      };
    },
    closeCreate() {
      this.modalVisible = false;
    },
    selectedObject(event) {
      this.objectList.selected = event;
    },
    selectObject(object) {
      if (object.action !== 'insert' && object.action !== 'objectList') {
        this.selectedObjectAf = object;
        this.$emit('selected', object);
        this.showSubModal = false;
      } else if (object.action === 'insert') {
        this.showInsertSubModal = true;
      } else if (object.action === 'objectList') {
        this.showInsertSubModalList = true;
      }
    },
  },
  computed: {
    allObjectsSelected() {
      const data = {};
      let allFilled = true;

      for (const key in this.databaseObjects) {
        const object = this.databaseObjects[key];

        if (object.selected === '' || object.selected === undefined || this.objectList.selected === '' || this.objectList.selected === undefined) {
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