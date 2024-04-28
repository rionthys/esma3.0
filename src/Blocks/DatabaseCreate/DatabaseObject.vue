<template>
  <div class="modal__content-select">
    <div class="modal-body">
      <div class="modal-header">
        <div class="modal-title">{{ title }}:</div>
        <div @click="subModal">({{ selectedObject.name }})</div>
      </div>
      <SubModal v-model:isVisible="showSubModal">
        <div class="filter__content">
          <div class="search-content">
            <input v-if="filteredObjects.filtered || objects.length > 1" v-model="searchQuery"
                   type="text">
            <input v-if="objects.length === 1 && objects[0].action === 'text'"
                   v-model="inputValue" type="text" @keyup.enter="selectObject({name: inputValue})">
            <img v-if="filteredObjects.filtered || objects.length > 1" alt="" src="../../assets/icons/search.png">
          </div>
          <div v-for="object in filteredObjects.objects" :key="object.id" class="object__select">
            <div v-if="!object.action || object.action === ''" @click="selectObject(object)">{{ object.name }}</div>
            <div v-if="object.action && object.action != '' && object.action !== 'date'" @click="object.options = true">
              {{ object.name }}
            </div>
            <input v-if="object.action === 'date'" v-model="inputValue" :type="object.action"
                   @change="handleDateChange"/>
            <SubModal v-model:isVisible="object.options">
                <span>
                  <input v-if="object.action === 'file'" :type="object.action" @change="handleFileChange"/>
                  <input v-else v-model="inputValue" :type="object.action"
                         @keyup.enter="selectObject({name: inputValue})"/>
                </span>
            </SubModal>
          </div>
        </div>
      </SubModal>
    </div>
  </div>
</template>

<script>
import {toRaw} from "vue";

export default {
  name: 'database-object',
  props: {
    title: String,
    objects: Array,
  },
  data() {
    return {
      searchQuery: '',
      showSubModal: false,
      showInsertSubModal: false,
      inputValue: '',
      inputFile: {},
      selectedObject: {name: 'выбрать'},
      optionsModal: '',
    };
  },
  computed: {
    filteredObjects() {
      const filters = this.objects.filter(object => {
            const obj = toRaw(object);
            console.log(obj);
            return obj && obj.name && obj.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          }
      );
      if (filters.length > 0) {
        return {filtered: true, objects: filters}
      } else {
        return {filtered: false, objects: [...this.objects]}
      }
    },
  },
  methods: {
    subModal() {
      this.showSubModal = true;
    },
    manualEntry() {
      // console.log('Ручной ввод данных');
      this.showSubModal = false;
    },
    selectObject(object) {
      this.selectedObject = object;
      // console.log('update:selected', object)
      this.$emit('update:selected', object);
      this.showSubModal = false;
    },
    handleFileChange() {
      const file = event.target.files[0];
      if (file) {
        this.selectObject(file);
      }
    },
    handleDateChange() {
      this.selectObject({name: this.inputValue});
    },
    showOptionsModal(name) {
      this.optionsModal = name;
    }
  },
  watch: {
    showSubModal(newVal) {
      if (!newVal) {
        const objects = this.objects.map((object) => {
          return {
            ...object,
            options: false,
          }
        });
        this.$emit('update:objects', objects);
      }
    }
  }
}
</script>

<style scoped>
input {
  border: unset;
  border-bottom: 1px solid #000;
  width: 100%;
}

.filter__content img {
  margin-left: 14px;
  width: 18px;
  cursor: pointer;
}

.modal__content-select {
  cursor: pointer;
  min-width: 222px;
}

.filter__content div {
  cursor: pointer;
}

.object__select {
  margin-top: 5px;
  width: max-content;
}

.object__select:first-child {
  margin-top: 10px;
}

.search-content {
  display: flex;
}
</style>
