<template>
  <section class="content">
    <div class="exit__user-wrapper">
      <LogoPage :logo="logo" title="Почта"/>
      <ExitUser :name="userName"/>
    </div>
    <BasicWrapper>
      <EmailForm/>
      <NavItems/>
    </BasicWrapper>
    <Modal v-for="(modal, index) in modalsFilters" :key="index" v-model:isVisible="modal.show">
      <div class="filter__content">
        <input v-model="modal.value" type="text" @keyup.enter="filterSelect(index, modal.show)">
        <img alt="" src="../assets/icons/search.png" @click="filterSelect(index, modal.show)">
      </div>
    </Modal>
  </section>
</template>

<script>
import UsersApi from "@/api/UsersApi";
import {ref} from 'vue';
import DatabaseObjectApi from '../api/DatabaseObjectApi';
import EmailForm from '../components/EmailForm.vue';

export default {
  name: 'database-page',
  components: {
    EmailForm
  },
  data() {
    return {
      currentFilterType: null,
      logo: this.$icons.mail,
      modalUpdate: ref(false),
      modalsFilters: {
        search: {field: 'поиск', show: false, value: ''},
        year: {field: 'год', show: false, value: ''},
        affairs: {field: 'дело', show: false, value: ''}
      },
      rights: UsersApi.rights,
      userName: UsersApi.name,
      menuVisible: false,
      menuPosition: {x: 0, y: 0},
      contextId: null,
      serviceUrl: 'https://ej2services.syncfusion.com/production/web-services/api/documenteditor/',
      headers: [540, 111, 151, 145, 210, 220, 730, 181, 511],
      rows: []
    }
  },
  mounted() {
    DatabaseObjectApi.get().then((response) => {
      if (response) {
        this.rows = response.data;
      }
    })
  },
  methods: {
    filterSelect(type, close = false) {
      this.modalsFilters[type].show = !close;
      this.currentFilterType = !close ? type : null;
    },
    navigateToDetails(id) {
      this.$router.push(`/database/details/${id}`);
    },
    navigateToAffairs(id) {
      this.$router.push(`/affairs/object/${id}`);
    },
    openContextMenu(event) {
      this.menuPosition = {x: event.clientX, y: event.clientY};
      this.menuVisible = true;
      this.contextId = 0;
      window.addEventListener('click', this.closeContextMenu);
    },
    closeContextMenu() {
      this.menuVisible = false;
      window.removeEventListener('click', this.closeContextMenu);
    },
    handleAddCase() {
      this.modalUpdate.value = true;
      this.closeContextMenu();
    },
  },
  computed: {
    filteredRows() {
      let result = [...this.rows];
      Object.keys(this.modalsFilters).forEach((filterType) => {
        const filterValue = typeof this.modalsFilters[filterType].value === 'string' ?
            this.modalsFilters[filterType].value.toLowerCase()
            : this.modalsFilters[filterType].value;
        if (filterValue) {
          result = result.filter((object) => {
            {
              if (filterType === 'year') {
                return String(object.dateRegistration).toLowerCase().includes(filterValue)
              } else if (typeof object[filterType] === "object") {
                if (object[filterType]) {
                  return (object[filterType].filter(
                      (ob) => {
                        if (typeof filterValue === 'string') {
                          const name = ob.name ? String(ob.name).toLowerCase().includes(filterValue) : false;
                          let number = false
                          if (ob.number) {
                            number = String(ob.name).toLowerCase().includes(filterValue);
                          } else if (ob.numberRegistration) {
                            number = String(ob.numberRegistration).toLowerCase().includes(filterValue);
                          }
                          return name || number;
                        } else {
                          return ob[filterValue.field] ? String(ob[filterValue.field]).toLowerCase().includes(filterValue.search) : false;
                        }
                      }
                  )).length > 0;
                } else {
                  return false;
                }
              } else if (filterType === 'affairs' || filterType === 'object' || filterType === 'status'
                  || filterType === 'client' || filterType === 'view') {
                return String(object[filterType]).toLowerCase().includes(filterValue)
              } else {
                return Object.values(object).some(value => {
                      if (value && typeof value === 'string') {
                        return String(value).toLowerCase().includes(filterValue)
                      } else if (value && typeof value === 'object') {
                        return Object.values(value).some(val => {
                          if (typeof val === 'string')
                            return String(val).toLowerCase().includes(filterValue)
                        })
                      }
                    }
                )
              }
            }
          })
        }
      });
      return result;
    }
  }
}
</script>

<style scoped>
main {
  display: flex;
  justify-content: center;
}

.ql-container {
  min-height: 10rem;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ql-editor {
  height: 100%;
  flex: 1;
  overflow-y: auto;
  width: 100%;
}


.toggle {
  width: 100%;
}

.exit__user-wrapper {
  display: flex;
  justify-content: space-between;
}

input {
  border: unset;
  border-bottom: 1px solid #000;
}

.filter__content img {
  margin-left: 7px;
  width: 18px;
  cursor: pointer;
}
</style>
