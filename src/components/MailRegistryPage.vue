<template>
  <section class="content">
    <div class="exit__user-wrapper">
      <LogoPage :logo="logo" title="базы данных"/>
      <div class="filters">
        <div class="filters__row">
          <div class="filter__row-container">
            <div v-for="(modal, index) in modalsFilters" :key="`show-${index}`"
                 class="filter__item"
                 @click="filterSelect(index)">
              {{ modal.field }}
            </div>
          </div>
        </div>
        <div class="filters__row">
          <div class="filter__row-container">
            <Toggle :isFilter="true" :items="['входящие', 'исходящие', 'все']"/>
          </div>
        </div>
      </div>
      <ExitUser :name="userName"/>
    </div>
    <BasicWrapper>
      <table class="database__table">
        <thead>
        <tr>
          <th></th>
          <th v-for="(header, index) in headers" :key="index" class="table__header">({{ header }})</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex">
          <td class="database__row">{{ row['number'] }}</td>
          <td class="database__row">{{ row['service'] }}</td>
          <td class="database__row">{{ row['date'] }}</td>
          <td class="database__row">{{ row['destination'] }}</td>
          <td class="database__row">{{ row['сontent'] }}</td>
        </tr>
        </tbody>
      </table>
    </BasicWrapper>
    <NavItems/>
    <Modal v-for="(modal, index) in modalsFilters" :key="index" v-model:isVisible="modal.show">
      <div v-if="index !== 'create'" class="filter__content">
        <input v-model="modal.value" type="text" @keyup.enter="filterSelect(index, modal.show)"/>
        <img alt="" src="../assets/icons/search.png" @keyup.enter="filterSelect(index, modal.show)">
      </div>
    </Modal>
    <MailRegistryCreateModal v-model:show="modalsFilters.create.show"/>
  </section>
</template>

<script>
import DatabaseObjectApi from '../api/DatabaseObjectApi';
import UsersApi from "@/api/UsersApi";

export default {
  name: 'database-page',
  data() {
    return {
      currentFilterType: null,
      logo: this.$icons.mailsRegistry,
      modalsFilters: {
        search: {field: 'поиск', show: false, value: ''},
        year: {field: 'год', show: false, value: ''},
        affairs: {field: 'дело', show: false, value: ''},
        object: {field: 'обьект', show: false, value: ''},
        client: {field: 'клиент', show: false, value: ''},
        create: {field: 'создать', show: false, value: ''},
      },
      rights: UsersApi.rights,
      userName: UsersApi.name,
      menuVisible: false,
      menuPosition: {x: 0, y: 0},
      contextId: null,
      headers: ['трек-номер', 'служба', 'дата', 'адресат', 'содержание'],
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
                return Object.values(object).some(value =>
                    String(value).toLowerCase().includes(filterValue)
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


.filter__row-container {
  max-width: 600px;
}
</style>
