<template>
  <section class="content">
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
            @click="navigateToDetails(row.id)"
            @contextmenu.prevent="openContextMenu($event, row.id)">
          <td class="affairs-table__row">{{ row.number ? row.number : '-' }}</td>
          <td class="affairs-table__row">{{
              row?.object?.name ? row?.object?.name : row?.object?.numberRegistration
            }}
          </td>
          <td class="affairs-table__row">{{ row.view ? row.view : '-' }}</td>
          <td class="affairs-table__row">{{ row.status ? row.status : '-' }}</td>
          <td class="affairs-table__row">{{ row.deadline ? row.deadline : '-' }}</td>
        </tr>
        </tbody>
      </table>
      <MailContextMenu :position="menuPosition" :visible="menuVisible" entity="дело" @addCase="sendMailModal"
                       @deleteCase="deleteCase" @editCase="editCase"/>
      <NavItems/>
    </BasicWrapper>
    <Modal v-for="(modal, index) in modalsFilters" :key="index" v-model:isVisible="modal.show">
      <div v-if="index !== 'create'" class="filter__content">
        <input v-model="modal.value" type="text" @keyup.enter="filterSelect(index, modal.show)"/>
        <img alt="" src="../assets/icons/search.png" @keyup.enter="filterSelect(index, modal.show)">
      </div>
    </Modal>
    <Modal v-model:isVisible="modalMail">
      <div class="modal-close" @click="closeModal"><img alt="" src="../assets/icons/cancel.png"></div>
      <div style="max-width: 750px">
        <EmailForm @close-modal="closeModal"/>
      </div>
    </Modal>
    <AffairsCreateModal v-model:show="modalsFilters.create.show" @add-affairs="loadAffairs"/>
  </section>
</template>

<script>
import AffairsApi from "@/api/AffairsApi";
import UsersApi from "@/api/UsersApi";
import EmailForm from "@/components/EmailForm.vue";
import MailContextMenu from "@/components/MailContextMenu.vue";
import AffairsCreateModal from '../Blocks/AffairsCreateModal.vue';

export default {
  name: 'affairs-page',
  components: {EmailForm, MailContextMenu, AffairsCreateModal},
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
      menuVisible: false,
      menuPosition: {x: 0, y: 0},
      activeHeaderIndex: null,
      currentFilterType: null,
      modalMail: false,
    }
  },
  mounted() {
    this.loadAffairs();
  },
  methods: {
    closeModal() {
      this.modalMail = false;
    },
    loadAffairs() {
      AffairsApi.get().then((response) => {
        if (response) {
          this.rows = response.data;
        }
      })
    },
    sendMailModal() {
      this.modalMail = true;
      this.closeContextMenu();
      AffairsApi.createLogs(this.contextId, {type: 'переписка', action: 'отправлено письмо'})
    },
    filterSelect(type, close = false) {
      this.modalsFilters[type].show = !close;
    },
    navigateToDetails(id) {
      this.$router.push(`/affairs/details/${id}`);
    },
    openContextMenu(event, id) {
      this.menuPosition = {x: event.clientX, y: event.clientY};
      this.menuVisible = true;
      this.contextId = id;
      window.addEventListener('click', this.closeContextMenu);
    },
    closeContextMenu() {
      this.menuVisible = false;
      window.removeEventListener('click', this.closeContextMenu);
    },
    async deleteCase() {
      await AffairsApi.delete(this.contextId);
      this.loadAffairs();
      this.closeContextMenu();
    },
    editCase() {
      this.$router.push({path: `/edit/affairs/${this.contextId}`});
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
                return String(object.created_at).toLowerCase().includes(filterValue)
              } else if (typeof object[filterType] === "object") {
                if (object[filterType]) {
                  if (typeof filterValue === 'string') {
                    const name = object[filterType].name ? String(object[filterType].name).toLowerCase().includes(filterValue) : false;
                    let number = false
                    if (object[filterType].number) {
                      number = String(object[filterType].name).toLowerCase().includes(filterValue);
                    } else if (object[filterType].numberRegistration) {
                      number = String(object[filterType].numberRegistration).toLowerCase().includes(filterValue);
                    }
                    return name || number;
                  } else {
                    return object[filterType][filterValue.field] ? String(object[filterType][filterValue.field]).toLowerCase().includes(filterValue.search) : false;
                  }
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
                      } else {
                        return false;
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
  watch: {}
}
</script>

<style scoped>
.modal-window {
  padding: 45px;
}

main {
  display: flex;
  justify-content: center;
}

table {
  margin-top: 15px;
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
