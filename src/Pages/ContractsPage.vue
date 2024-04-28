<template>
  <section class="content">
    <div class="exit__user-wrapper">
      <LogoPage :logo="logo" title="договоры"/>
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
            @contextmenu.prevent="openContextMenu($event, row.id)">
          <td class="affairs-table__row">{{ row.number ? row.number : '-' }}</td>
          <td class="affairs-table__row">{{ row?.client ? row?.client?.name : '-' }}</td>
          <td class="affairs-table__row">{{ row.status ? row.status : '-' }}</td>
          <td class="affairs-table__row">
            <div v-if="row.ds && row.ds.length > 0">
              <div v-for="ds in row.ds" :key="ds.id" class="ds__item">
                <div>Описание: {{ ds.description }}</div>
                <div v-if="typeof ds.document === 'string' && !ds.document.includes('{')" @click="showDoc(ds.document)">
                  Документ: {{
                    ds.document ? ds.document : '-'
                  }}
                </div>
              </div>
            </div>
            <div v-else>
              -
            </div>
          </td>
          <td class="affairs-table__row">
            <img alt="" src="../assets/icons/doc-black.png" style="cursor: pointer" @click="navigateToDetails(row.id)">
          </td>
        </tr>
        </tbody>
      </table>
      <DeleteItem :position="menuPosition" :visible="menuVisible" entity="договор" @deleteCase="deleteCase"
                  @editCase="editCase"/>
      <NavItems/>
    </BasicWrapper>
    <div v-for="row in rows" :key="row.id" class="fixed">
      <div v-for="ds in row.ds" :key="ds.id"
           :class="[{'d-none': !ds.document || ds.document !== pdfSrc}]">
        <IframeModal v-model:isVisible="showPdf">
          <div class="modal-close" @click="closeDoc"><img alt="" src="../assets/icons/cancel.png"></div>
          <div style="width: 700px; height: 470px">
            <iframe :key="`${pdfSrc}`"
                    :src="`https://docs.google.com/gview?url=https://echo-cloud.store/upload/${ ds?.document ? ds?.document : ''}&embedded=true&time=${new Date().getTime()}`"
                    frameborder='0'
                    style="width: 98%; height: 100%"

            >
              <p>Ваш браузер не поддерживает загрузку содержимого</p>
            </iframe>
          </div>
        </IframeModal>
      </div>
    </div>
    <Modal v-for="(modal, index) in modalsFilters" :key="index" v-model:isVisible="modal.show">
      <div v-if="index !== 'create'" class="filter__content">
        <input v-model="modal.value" type="text" @keyup.enter="filterSelect(index, modal.show)"/>
        <img alt="" src="../assets/icons/search.png" @keyup.enter="filterSelect(index, modal.show)">
      </div>
    </Modal>
    <ContractsCreateModal v-model:show="modalsFilters.create.show" @add-contracts="loadContracts"/>
  </section>
</template>

<script>
import ContractsApi from "@/api/ContractsApi";
import UsersApi from "@/api/UsersApi";
import ContractsCreateModal from "@/Blocks/ContractsCreateModal.vue";
import DeleteItem from "@/components/DeleteItem.vue";
import IframeModal from "@/components/IFrameModal.vue";

export default {
  name: 'affairs-page',
  components: {IframeModal, ContractsCreateModal, DeleteItem},
  data() {
    return {
      logo: this.$icons.contracts,
      isAscending: false,
      userName: UsersApi.name,
      rights: UsersApi.rights,
      modalsFilters: {
        search: {field: 'поиск', show: false, value: ''},
        year: {field: 'год', show: false, value: ''},
        object: {field: 'объект', show: false, value: ''},
        client: {field: 'клиент', show: false, value: ''},
        status: {field: 'статус', show: false, value: ''},
        create: {field: 'создать', show: false, value: ''},
      },
      headers: ['номер', 'client', 'статус', 'ДС'],
      headersKey: ['number', 'object', 'status', 'ds'],
      rows: [],
      menuVisible: false,
      menuPosition: {x: 0, y: 0},
      activeHeaderIndex: null,
      currentFilterType: null,
      showPdf: false,
      pdfSrc: '',
    }
  },
  mounted() {
    this.loadContracts();
  },
  methods: {
    loadContracts() {
      ContractsApi.get().then((response) => {
        if (response) {
          this.rows = response.data;
        }
      })
      setTimeout(() => this.pdfSrc = 1500, 1500);
    },
    showDoc(src) {
      if (src) {
        this.showPdf = true;
        this.pdfSrc = src;
      }
    },
    filterSelect(type, close = false) {
      this.modalsFilters[type].show = !close;
    },
    closeDoc() {
      this.showPdf = false;
    },
    navigateToDetails(id) {
      this.$router.push(`/contracts/details/${id}`);
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
      await ContractsApi.delete(this.contextId);
      this.loadContracts();
      this.closeContextMenu();
    },
    editCase() {
      this.$router.push({path: `/edit/contracts/${this.contextId}`});
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

.affairs-table__row img {
  width: 30px;
}

@media (min-width: 1440px) {
  .filters {
    justify-content: center;
    height: 68px;
  }
}

.ds__item + .ds__item {
  margin-top: 7px;
}
</style>
