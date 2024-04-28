<template>
  <SubModal v-model:isVisible="modalVisible">
    <div class="modal-close" @click="closeCreate"><img alt="" src="../assets/icons/cancel.png"></div>
    <div class="modal__content-title">Пожалуйста выберите:</div>
    <DatabaseObject v-for="(object, index) in databaseObjects"
                    :key="index"
                    :objects="object.values"
                    :title="object.title"
                    @update:selected="object.selected = $event"
                    @update:objects="object.values = $event"/>
  </SubModal>
</template>

<script>
import DatabaseObject from './DatabaseCreate/DatabaseObject.vue';
import DatabaseObjectApi from '../api/DatabaseObjectApi';
import UploadApi from "@/api/UploadApi";

export default {
  name: 'database-list',
  props: {
    show: Boolean,
  },
  components: {DatabaseObject},
  emits: ['update:isVisible'],
  data() {
    return {
      modalVisible: false,
      databaseObjects: {
        niceClasses: {
          title: 'Классы МКТУ',
          values: [
            {name: 'text'},
          ],
          selected: ''
        }
      }
    }
  },
  watch: {
    show(newVal) {
      this.modalVisible = newVal;
    },
    modalVisible(newVal) {
      this.$emit('update:show', newVal);
    },
    async allSelectedFilled(newVal) {
      if (newVal) {
        if (newVal.data.trademark.name.split('.').length > 1) {
          newVal.data.trademark = (await UploadApi.upload(newVal.data.trademark)).data.fileName;
        }
        const object = await DatabaseObjectApi.create(newVal.data);
        if (object.data.id !== undefined) {
          this.$emit('update:objectSelect', object.data);
        }
      }
    },
  },
  computed: {
    allSelectedFilled() {
      const selected = {};
      try {
        for (const object of Object.entries(this.databaseObjects)) {
          if (!object[1].selected && object[1].selected === '' && !object[1].selected.name) {
            return false;
          }
          if (object[1].selected.name.split('.').length > 1) {
            selected[object[0]] = object[1].selected;
          } else {
            selected[object[0]] = object[1].selected.name
          }
        }
        return {isValid: true, data: selected};
      } catch (e) {
        console.log(e);
        return {isValid: false, data: selected};
      }
    }
  },
  methods: {
    closeCreate() {
      this.modalVisible = false;
    },
  },
  mounted() {
    this.modalVisible = this.show;
  },
}
</script>