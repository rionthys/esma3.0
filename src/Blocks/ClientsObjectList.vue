<template>
  <div class="modal__content-select">
    <div class="modal-body">
      <div class="modal-header">
        <div class="modal-title">{{ title }}:</div>
        <div @click="subModal">({{ selectedObject.name }})</div>
      </div>
      <SubModal v-model:isVisible="showSubModal">
        <div class="filter__content">
          <div class="object__select">
            <CreateClient @update:objectSelect="selectObject"/>
            <DatabaseObject
                v-model:show="showInsertSubModalList"
                :objects="databaseList"
                title="существующие клиенты"
                @update:selected="selectObject"
            />
          </div>
        </div>
      </SubModal>
    </div>
  </div>
</template>
<script>
import DatabaseObject from "@/Blocks/DatabaseCreate/DatabaseObject.vue";
import ClientsApi from "@/api/ClientsApi";
import CreateClient from "@/Blocks/CreateClient.vue";

export default {
  name: 'object-create',
  components: {
    DatabaseObject,
    CreateClient
    // DatabaseList
  },
  props: {
    title: String,
    objects: Array,
  },
  emits: ['selected'],
  data() {
    return {
      searchQuery: '',
      showSubModal: false,
      showInsertSubModal: true,
      showInsertSubModalList: false,
      selectedObject: {name: 'выбрать'},
      databaseList: []
    };
  },
  computed: {
    filteredObjects() {
      return this.objects.filter(object =>
          object.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    subModal() {
      this.showSubModal = true;
    },
    filterSelect() {
      // console.log(status)
    },
    manualEntry() {
      this.showSubModal = false;
    },
    selectObject(object) {
      if (object.action !== 'insert' && object.action !== 'objectList') {
        this.selectedObject = object;
        this.$emit('selected', object);
        this.showSubModal = false;
      } else if (object.action === 'insert') {
        this.showInsertSubModal = true;
      } else if (object.action === 'objectList') {
        this.showInsertSubModalList = true;
      }
    },
  },
  mounted() {
    ClientsApi.get().then((response) => {
      this.databaseList = response.data.map((object) => {
        const name = object.name ? object.name : 'client not found';
        return {
          name,
          id: object.id,
        }
      })
    })
  },
  watch: {
    showSubModal(newVal) {
      if (!newVal) {
        this.showInsertSubModal = newVal;
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
