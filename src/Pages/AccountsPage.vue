<template>
  <section class="content">
    <div class="exit__user-wrapper">
      <LogoPage :logo="logo" title="счета"/>
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
          <div class="filter__row-container">
            <div v-if="rights.create" class="filter__item"
                 @click="triggerFileInput">
              импортировать
              <input ref="fileInput" style="display: none;" type="file" @change="handleFileUpload"/>
            </div>
          </div>
        </div>
        <div class="filters__row">
          <div class="filter__row-container">
            <div class="filter__toggle">
              <Toggle :items="['счета', 'прайс лист']" @item-selected="changeTab($event)"/>
            </div>
          </div>
        </div>
      </div>
      <ExitUser :name="userName"/>
    </div>
    <BasicWrapper>
      <table v-if="tab === 'счета'" class="database__table">
        <thead>
        <tr>
          <th v-for="(header, index) in headers"
              :key="index"
              class="table__header affairs-table__header">
            <div v-if="header === 'имя'" class="jsc">{{ header }}</div>
            <div v-else class="jsc">{{ header }}</div>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex" class="affairs-details-tr_table"
            @contextmenu.prevent="openContextMenu($event, row.id, 'accounts')">
          <td class="affairs-table__row">
            <div class="jsc">
              {{ row.client && row.client.name ? row.client.name : '-' }}
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              {{ row.date ? row.date : '-' }}
            </div>
          </td>
          <td class="affairs-table__row">
            <div :class="['jsc', {'pointer': row.affair}]"
                 @click="navigateToAffairs(row.affair ? row.affair.id : undefined)">
              {{ row.affair && row.affair.number ? row.affair.number : '-' }}
            </div>
          </td>
          <td class="affairs-table__row">
            <div :class="['jsc', {'pointer': row.affair}]"
                 @click="navigateToAffairs(row.affair ? row.affair.id : undefined)">
              {{ row.state ? 'оплачен' : 'не оплачен' }}
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              {{ row.price ? row.price : '-' }}
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              {{ row.gospos ? row.gospos : '-' }}
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              {{ row.type ? row.type : '-' }}
            </div>
          </td>
          <td class="affairs-table__row">
            <div @click="showDoc(row.invoice)">
              <img alt=""
                   src="../assets/icons/doc-black.png">
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <table v-if="tab === 'прайс лист'" class="database__table">
        <thead>
        <tr v-if="prices.length > 0">
          <th v-for="(header, index) in Object.entries(prices[0].value).reverse()"
              :key="index"
              class="table__header affairs-table__header">
            <div class="jsc">{{ header[0] }}</div>
          </th>
        </tr>
        </thead>
        <tbody v-if="prices.length > 0">
        <tr v-for="(row, rowIndex) in prices" :key="rowIndex" class="affairs-details-tr_table"
            @contextmenu.prevent="openContextMenu($event, row.id, 'price')">
          <td v-for="price in Object.entries(row.value).reverse()" :key="price" class="affairs-table__row">
            <div class="jsc">
              {{ price[1] }}
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <NavItems/>
    </BasicWrapper>
    <div v-for="row in filteredRows" :key="row.id"
         :class="['fixed', {'d-none': !row.invoice || row.invoice !== pdfSrc}]"
         style="position: absolute">
      <IframeModal v-model:isVisible="showPdf">
        <div class="modal-close" @click="closeDoc"><img alt="" src="../assets/icons/cancel.png"></div>
        <div style="width: 700px; height: 470px">
          <iframe :key="`${pdfSrc}`"
                  :src="`https://docs.google.com/gview?url=https://echo-cloud.store/upload/${ row?.invoice ? row?.invoice : ''}&embedded=true&time=${new Date().getTime()}`"
                  frameborder='0'
                  style="width: 98%; height: 100%"

          >
            <p>Ваш браузер не поддерживает загрузку содержимого</p>
          </iframe>
        </div>
      </IframeModal>
    </div>
    <MailAccountsContext :position="menuPosition" :visible="menuVisible" entity="дело" @addCase="sendMailModal"
                         @deleteCase="deleteCase" @editCase="editCase"/>
    <Modal v-for="(modal, index) in modalsFilters" :key="index" v-model:isVisible="modal.show">
      <div v-if="index !== 'create'" class="filter__content">
        <input v-model="modal.value" type="text" @keyup.enter="filterSelect(index, modal.show)"/>
        <img alt="" src="../assets/icons/search.png" @keyup.enter="filterSelect(index, modal.show)">
      </div>
    </Modal>
    <Modal v-model:isVisible="modalMail">
      <div class="modal-close" @click="closeModal"><img alt="" src="../assets/icons/cancel.png"></div>
      <div style="max-width: 750px">
        <EmailForm :contextObject="contextDoc" @close-modal="closeModal"/>
      </div>
    </Modal>
    <AccountsCreate v-model:show="modalsFilters.create.show" @add-affairs="loadAffairs"/>
  </section>
</template>

<script>
import AccountsApi from "@/api/AccountsApi";
import PriceListApi from "@/api/PriceListApi";
import UploadApi from "@/api/UploadApi";
import UsersApi from "@/api/UsersApi";
import AccountsCreate from "@/Blocks/AccountsCreateModal.vue";
import {toRaw} from "vue";
import IframeModal from "@/components/IFrameModal.vue";
import MailAccountsContext from "@/components/MailAccountsContext.vue";
import AffairsApi from "@/api/AffairsApi";
import EmailForm from "@/components/EmailForm.vue";

export default {
  name: 'affairs-page',
  components: {EmailForm, MailAccountsContext, IframeModal, AccountsCreate},
  data() {
    return {
      logo: this.$icons.accounts,
      rights: UsersApi.rights,
      isAscending: false,
      userName: UsersApi.name,
      modalsFilters: {
        search: {field: 'поиск', show: false, value: ''},
        client: {field: 'клиент', show: false, value: ''},
        date: {field: 'год', show: false, value: ''},
        affair: {field: 'дело', show: false, value: ''},
        status: {field: 'статус', show: false, value: ''},
        create: {field: 'создать', show: false, value: ''},
      },
      headers: ['клиент', 'дата', 'дело', 'статус', 'гонорар', 'гос. пошлины', 'валюта', ''],
      headersKey: ['client', 'date', 'affair', 'state', 'price', 'gospos'],
      rows: [],
      prices: [],
      contextType: '',
      menuVisible: false,
      menuPosition: {x: 0, y: 0},
      activeHeaderIndex: null,
      currentFilterType: null,
      tab: 'счета',
      fileInput: null,
      showPdf: false,
      pdfSrc: null,
      modalMail: false,
      contextDoc: false,
    }
  },
  mounted() {
    this.loadAffairs();
    this.loadPrice();
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
    loadAffairs() {
      AccountsApi.get().then((response) => {
        if (response) {
          this.rows = response.data;
        }
      })
      setTimeout(() => this.pdfSrc = 1500, 1500);
    },
    sendMailModal() {
      this.modalMail = true;
      this.closeContextMenu();
      AffairsApi.createLogs(this.contextId, {type: 'переписка', action: 'отправлено письмо'})
    },
    closeModal() {
      this.modalMail = false;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        console.log('Файл не выбран');
        return;
      }
      const fileName = (await UploadApi.upload(file)).data.fileName;
      UploadApi.uploadExcel({path: `./uploads/${fileName}`}).then((response) => {
        if (response.data) {
          this.loadPrice();
        }
      });
    },
    editCase() {
      this.$router.push({path: `/edit/accounts/${this.contextId}`});
    },
    navigateToAffairs(id) {
      if (id) {
        this.$router.push({path: `/affairs/details/${id}`})
      }
    },
    loadPrice() {
      PriceListApi.get().then((response) => {
        if (response) {
          this.prices = response.data;
        }
      })
    },
    filterSelect(type, close = false) {
      this.modalsFilters[type].show = !close;
    },
    changeTab(tab) {
      this.tab = tab;
    },
    openContextMenu(event, id, type) {
      this.menuPosition = {x: event.clientX, y: event.clientY};
      this.menuVisible = true;
      this.contextDoc = toRaw(this.rows).find((invoice) => invoice.id === id)?.invoice;
      console.log(toRaw(this.rows).find((invoice) => invoice.id === id))
      console.log(this.contextDoc);
      this.contextId = id;
      this.contextType = type;
      window.addEventListener('click', this.closeContextMenu);
    },
    closeContextMenu() {
      this.menuVisible = false;
      window.removeEventListener('click', this.closeContextMenu);
    },
    async deleteCase() {
      if (this.contextType === 'accounts') {
        await AccountsApi.delete(this.contextId);
        this.loadAffairs();
        this.closeContextMenu();
      } else if (this.contextType === 'price') {
        await PriceListApi.delete(this.contextId);
        this.loadPrice();
        this.closeContextMenu();
      }
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
              const filterObject = toRaw(object);
              if (filterType === 'year') {
                return String(filterObject.date).toLowerCase().includes(filterValue)
              } else if (typeof filterObject[filterType] === "object") {
                if (filterObject[filterType]) {
                  console.log('object', filterObject)
                  console.log('filterType', filterType)
                  console.log('filterValue', filterValue)
                  if (typeof filterValue === 'string') {
                    const name = filterObject[filterType].name ? String(filterObject[filterType].name).toLowerCase().includes(filterValue) : false;
                    let number = false
                    if (object[filterType].number) {
                      number = String(filterObject[filterType].name).toLowerCase().includes(filterValue);
                    } else if (filterObject[filterType].numberRegistration) {
                      number = String(filterObject[filterType].numberRegistration).toLowerCase().includes(filterValue);
                    }
                    return name || number;
                  } else {
                    return filterObject[filterType][filterValue.field] ? String(filterObject[filterType][filterValue.field]).toLowerCase().includes(filterValue.search) : false;
                  }
                } else {
                  return false;
                }
              } else if (filterType === 'affairs' || filterType === 'object' || filterType === 'status'
                  || filterType === 'client' || filterType === 'view') {
                return String(filterObject[filterType]).toLowerCase().includes(filterValue)
              } else {
                return Object.values(filterObject).some(value => {
                      if (value && typeof value === 'string') {
                        return String(value).toLowerCase().includes(filterValue)
                      } else if (value && typeof value === 'object') {
                        return Object.values(value).some(val => {
                          if (value && typeof val === 'string')
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
    },
  },
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

img {
  width: 24px;
}

.jsc {
  display: flex;
  justify-content: center;
}

.jsc input {
  width: 16px;
  height: 16px;
}

.toggle {
  width: 270px;
}

.pointer {
  cursor: pointer;
}


.modal-window {
  padding: 45px;
}

@media (min-width: 1440px) {
  .filters {
    justify-content: center;
    height: 68px;
  }
}
</style>
