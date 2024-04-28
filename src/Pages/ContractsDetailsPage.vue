<template>
  <section class="content">
    <div class="header-details">
      <div class="exit__user-wrapper">
        <LogoPage :logo="logo" title="договоры"/>
        <div class="filters">
          <div class="filters__row">
            <div class="filter__row-container">
              <div v-for="(modal, index) in modalsFilters"
                   :key="`show-${index}`"
                   class="filter__item"
                   @click="filterSelect(index)">
                {{ modal.field }}
              </div>
              <div v-if="contract.object" class="filter__item"
                   @click="navigateToObject()">
                объект
              </div>
              <div v-if="rights.create" class="filter__item"
                   @click="showAction()">
                создать документ
              </div>
              <div v-if="rights.create" class="filter__item"
                   @click="showDS()">
                новое ДС
              </div>
              <div class="filter__item"
                   @click="navigateToAffairs()">
                дела по договору
              </div>
            </div>
          </div>
        </div>
        <ExitUser :name="userName"/>
      </div>
      <div class="details">
        <div class="desctiption">{{ contract?.number }} {{ contract?.client }} до
          {{ contract?.deadline ? contract?.deadline.split('T')[0] : '' }}
        </div>
      </div>
    </div>
    <BasicWrapper>
      <table class="database__table">
        <thead>
        <tr>
          <th class="affairs-details-table__header"></th>
          <th v-for="(header, index) in headers"
              :key="index"
              :class="['table__header affairs-details-table__header', { 'is-ascending': isAscending, 'is-descending': !isAscending }]"
              @click="toggleSortDirection">{{ header }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex" class="affairs-tr_table">
          <td class="affairs-details-table__row">
            <img v-if="row.type === 'исходящее'" alt="исходящее" class="rotate" src="../assets/icons/arrow.png">
            <img v-if="row.type === 'входящее'" alt="входящее" src="../assets/icons/arrow.png">
            <div v-if="row.type === 'переписка'">@</div>
          </td>
          <td class="affairs-details-table__row">
            {{ row.created_at ? row.created_at.split('T')[0] : '-' }}
          </td>
          <td class="affairs-details-table__row">
            {{ row.action ? row.action : '-' }}
          </td>
          <td class="affairs-details-table__row" @click="showDoc(row.document)">
            {{ row?.document?.length > 0 ? row.document.join('\n') : '-' }}
          </td>
          <td class="affairs-details-table__row">
            {{ row.responsible.name ? row.responsible.name : '-' }}
          </td>
        </tr>
        </tbody>
      </table>
      <NavItems/>
    </BasicWrapper>
    <CreateLogContract v-model:isVisible="showModalAction" @add-log="createAction()"/>
    <Modal v-for="(modal, index) in modalsFilters" :key="index" v-model:isVisible="modal.show">
      <div class="filter__content">
        <input v-model="modal.value" type="text" @keyup.enter="filterSelect(index, modal.show)"/>
        <img alt="" src="../assets/icons/search.png" @keyup.enter="filterSelect(index, modal.show)">
      </div>
    </Modal>
    <Modal v-model:isVisible="showModalDS">
      <DsCreateModal title="Дс"
                     @selected="updateDS"/>
    </Modal>
    <div v-for="row in rows" :key="(row.id + filteredRows.length)"
         :class="['fixed', {'d-none': !row.document || row.document.length === 0 || row.document !== pdfSrc}]"
         style="position: fixed">
      <IframeModal v-model:isVisible="showPdf">
        <div class="modal-close" @click="closeDoc"><img alt="" src="../assets/icons/cancel.png"></div>
        <div style="width: 700px; height: 470px">
          <iframe
              :key="pdfSrc"
              :src="`https://docs.google.com/gview?url=https://echo-cloud.store/upload/${row?.document ? row?.document[0] : ''}&embedded=true`"
              frameborder='0'
              style="width: 98%; height: 100%"
          >
            <p>Ваш браузер не поддерживает загрузку содержимого</p>
          </iframe>
        </div>
      </IframeModal>
    </div>
  </section>
</template>

<script>
import ContractsApi from "@/api/ContractsApi";
import UsersApi from "@/api/UsersApi";
import CreateLogContract from "@/Blocks/CreateLogContract.vue";
import IframeModal from "@/components/IFrameModal.vue";
import DsCreateModal from "@/Blocks/DsCreateModal.vue";
import {toRaw} from "vue";

export default {
  name: 'contracts-details',
  components: {
    DsCreateModal,
    IframeModal,
    CreateLogContract,
  },
  data() {
    return {
      logo: this.$icons.contracts,
      isAscending: false,
      modalsFilters: {
        search: {field: 'поиск', show: false, value: ''},
      },
      rights: UsersApi.rights,
      userName: UsersApi.name,
      contract: {},
      showModalAction: false,
      showModalDS: false,
      newDS: '',
      users: [],
      headers: ['дата', 'действие', 'документы', 'исполнитель'],
      rows: [],
      showPdf: false,
      contentLoaded: false,
      pdfSrc: '',
      objectId: null,
    }
  },
  methods: {
    showDoc(src) {
      if (src) {
        this.showPdf = true;
        this.pdfSrc = src;
      }
    },
    closeDoc() {
      this.showPdf = false;
    },
    loadLogs() {
      ContractsApi.getLogs(this.$route.params.id).then((response) => {
        if (response) {
          this.rows = response.data;
        }
      })
      setTimeout(() => this.pdfSrc = 1500, 1500);

    },
    navigateToObject() {
      this.$router.push({path: `/database/details/${this.objectId}`})
    },
    filterSelect(type, close = false) {
      this.modalsFilters[type].show = !close;
    },
    toggleSortDirection() {
      this.isAscending = !this.isAscending;
    },
    createAction() {
      this.loadLogs();
      this.showModalAction = false;
    },
    showAction() {
      this.showModalAction = true;
    },
    showDS() {
      this.showModalDS = true;
    },
    updateDS(event) {
      ContractsApi.update(this.$route.params.id, {ds: toRaw(event)});
      this.showModalDS = false;
    },
    navigateToAffairs() {
      this.$router.push(`/affairs/contracts/${this.$route.params.id}`);
    },
    closeCreate() {
      this.showModalAction = this.showModalResponsible = false;
    }
  },
  mounted() {
    this.loadLogs();
    ContractsApi.getById(this.$route.params.id).then((response) => {
      if (response) {
        this.contract = response.data;
        this.objectId = response?.data?.object?.id
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
                return String(object.created_at).toLowerCase().includes(filterValue)
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

.details {
  display: flex;
  align-items: center;
  margin-top: 40px;
  justify-content: center;
}

.title {
  font-weight: 600;
  font-size: 20px;
  width: 7%;
}

.desctiption {
  font-size: 20px;
  margin-left: 30px;
  max-width: 25%;
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

.rotate {
  transform: rotateY(180deg);
}

img {
  width: 18px;
}

.affairs-tr_table {
  cursor: unset;
}

.desctiption {
  text-align: center;
  width: 100%;
  font-size: 20px;
}

@media (min-width: 1440px) {
  .filters {
    justify-content: center;
    height: 68px;
  }
}
</style>
