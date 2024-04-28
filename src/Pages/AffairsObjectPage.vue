<template>
  <section class="content">
    <div class="header-details">
      <div class="exit__user-wrapper">
        <LogoPage :logo="logo" title="дела"/>
        <div class="filters">
          <div class="filters__row">
            <div class="filter__row-container">
              <div v-for="(modal, index) in modalsFilters"
                   :key="`show-${index}`">
                <div v-if="index !== 'create'" class="filter__item"
                     @click="filterSelect(index)">
                  {{ modal.field }}
                </div>
                <div v-else-if="rights.create" class="filter__item" @click="filterSelect(index)">
                  {{ modal.field }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ExitUser :name="userName"/>
      </div>
      <div class="details">
        <div class="title">объект:</div>
        <div class="desctiption">{{ object?.name }}</div>
        <div class="desctiption">{{ object?.territory }}</div>
        <div class="desctiption">{{ object?.applicationNumber }}</div>
        <div class="desctiption">{{ object?.priorityNumber }}</div>
      </div>
    </div>
    <BasicWrapper>
      <table class="database__table">
        <thead>
        <tr>
          <th v-for="(header, index) in headers"
              :key="index"
              :class="['table__header affairs-table__header is-descending', { 'is-ascending': activeHeaderIndex === null || (isAscending && activeHeaderIndex === index) }]"
              @click="toggleSortDirection(index)">({{ header }})
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex" class="affairs-details-tr_table"
            @click="navigateToDetails(row.id)">
          <td class="affairs-table__row">{{ row.number ? row.number : '-' }}</td>
          <td class="affairs-table__row">{{ row?.object?.name ? row?.object?.name : '-' }}</td>
          <td class="affairs-table__row">{{ row.view ? row.view : '-' }}</td>
          <td class="affairs-table__row">{{ row.status ? row.status : '-' }}</td>
          <td class="affairs-table__row">{{ row.deadline ? row.deadline : '-' }}</td>
        </tr>
        </tbody>
      </table>
      <NavItems/>
    </BasicWrapper>
    <Modal v-for="(modal, index) in modalsFilters" :key="index" v-model:isVisible="modal.show">
      <div v-if="index !== 'create'" class="filter__content">
        <input v-model="modal.value" type="text" @keyup.enter="filterSelect(index, modal.show)"/>
        <img alt="" src="../assets/icons/search.png" @keyup.enter="filterSelect(index, modal.show)">
      </div>
    </Modal>
    <AffairsCreateModal v-model:show="modalsFilters.create.show" :exist="true" @add-affairs="getObjectById"/>
  </section>
</template>

<script>
import AffairsApi from "@/api/AffairsApi";
import DatabaseObjectApi from "@/api/DatabaseObjectApi";
import UsersApi from "@/api/UsersApi";
import AffairsCreateModal from "@/Blocks/AffairsCreateModal.vue";

export default {
  name: 'affairs-page',
  components: {AffairsCreateModal},
  data() {
    return {
      logo: this.$icons.affairs,
      isAscending: false,
      userName: UsersApi.name,
      rights: UsersApi.rights,
      modalsFilters: {
        search: {field: 'поиск', show: false, value: ''},
        year: {field: 'год', show: false, value: ''},
        view: {field: 'вид', show: false, value: ''},
        object: {field: 'объект', show: false, value: ''},
        client: {field: 'клиент', show: false, value: ''},
        status: {field: 'статус', show: false, value: ''},
        create: {field: 'создать', show: false, value: ''},
      },
      headers: ['номер', 'объект', 'вид', 'статус', 'срок'],
      headersKey: ['number', 'object', 'view', 'status', 'deadline'],
      rows: [],
      activeHeaderIndex: null,
      currentFilterType: null,
      object: {}
    }
  },
  methods: {
    filterSelect(type, close = false) {
      this.modalsFilters[type].show = !close;
    },
    navigateToDetails(id) {
      this.$router.push(`/affairs/details/${id}`);
    },
    getObjectById() {
      AffairsApi.getByObjectId(this.$route.params.id).then((response) => {
        if (response) {
          this.rows = response.data;
        }
      })
    },
    toggleSortDirection(index) {
      const field = this.headersKey[index];

      if (this.activeHeaderIndex === index) {
        this.isAscending = !this.isAscending;
      } else {
        this.activeHeaderIndex = index;
        this.isAscending = true;
      }

      this.rows = this.rows.sort((a, b) => {
        let aValue = a[field];
        let bValue = b[field];

        if (field === 'object' && aValue && bValue) {
          aValue = aValue?.name;
          bValue = bValue?.name;
        } else if (field === 'deadline') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
        }
        if (typeof bValue === 'string') {
          bValue = bValue.toLowerCase();
        }

        if (this.isAscending) {
          return aValue > bValue ? 1 : (aValue < bValue ? -1 : 0);
        } else {
          return aValue < bValue ? 1 : (aValue > bValue ? -1 : 0);
        }
      });
    },
  },
  mounted() {
    this.getObjectById();
    DatabaseObjectApi.getById(this.$route.params.id).then((response) => {
      if (response) {
        this.object = response.data;
      }
    })
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
  },
}
</script>

<style scoped>

.details {
  display: flex;
  align-items: center;
  margin-top: 60px;
}

.title {
  font-weight: 600;
  font-size: 20px;
  width: 7%;
}

.desctiption {
  font-size: 20px;
  margin-left: 30px;
  width: 25%;
}

.desctiption:last-child {
  width: 100%;
}

main {
  display: flex;
  justify-content: center;
}

.exit__user-wrapper {
  display: flex;
  justify-content: space-between;
}

.filter__row-container {
  margin-top: 3px;
}

.filters__row {
  max-width: 910px;
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

@media (min-width: 1440px) {
  .filters {
    justify-content: center;
    height: 68px;
  }
}
</style>
