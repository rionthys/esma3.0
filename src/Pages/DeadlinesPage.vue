<template>
  <section class="content">
    <div class="exit__user-wrapper">
      <LogoPage :large="true" :logo="logo" title="сроки"/>
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
            <div class="mx-150">
              <Toggle :isImg="true"
                      :items="[{ src: burger, name: 'list' }, { src: grid, name: 'calendar' }]"
                      @item-selected="typeWrapper"/>
            </div>
          </div>
        </div>
        <div v-if="type === 'list'" class="filters__row">
          <FilterText :items="columns" @active="activeItems($event)"/>
        </div>
      </div>
      <ExitUser :name="userName"/>
    </div>
    <BasicWrapper>
      <div v-if="type === 'calendar'" class="d-flex w-100">
        <v-date-picker v-model="range" is-range>
        </v-date-picker>
        <div class="deadlines__info">
          <div class="deadlines__filters">
            <div class="deadlines__filters-range">
              <div class="filter__item">период: {{ formatDate(range.start) }} - {{ formatDate(range.end) }}</div>
            </div>
            <div class="deadlines__toggle">
              <div class="filter__row-container">
                <Toggle :allowMultiple="true" :items="['действия', 'оплаты']" @item-selected="changeRootItem"/>
              </div>
              <div v-if="rootItem === 'оплаты'" class="filter__row-container">
                <Toggle :items="['оплачены', 'все']" @item-selected="changeChildItem"/>
              </div>
              <div v-if="rootItem === 'действия'" class="filter__row-container">
                <Toggle :items="['кол-во', 'сумма']" @item-selected="changeChildItem"/>
              </div>
            </div>
          </div>
          <div v-if="rootItem === null" class="deadlines__info-text">
            <div>Итого:</div>
            <div>Действий: {{ filteredRange?.countActions }}</div>
            <div>Оплат: {{ filteredRange?.accounts?.length }}</div>
          </div>
          <div v-if="rootItem === 'действия' && childItem === 'кол-во'" class="deadlines__info-text">
            <div>Итого, действий:</div>
            <div v-for="(index,object) in filteredRange.countAllActions" :key="object">{{ index }}: {{
                object
              }}
            </div>
          </div>
          <div v-if="rootItem === 'оплаты' && childItem === 'оплачены'" class="deadlines__info-text">
            <div>{{ filteredRange.sumSuccessPayments }} тенге, из них:</div>
            <div v-for="(index,object) in filteredRange.countSuccessPayments" :key="object">{{ object }}: {{
                index
              }}
            </div>
          </div>
          <div v-if="rootItem === 'действия' && childItem === 'сумма'" class="deadlines__info-text">
            <div>Итого, действий:</div>
            <div>Действий: {{ filteredRange?.countActions }}</div>
          </div>
          <div v-if="rootItem === 'оплаты' && childItem === 'все'" class="deadlines__info-text">
            <div>{{ filteredRange.totalPaymentsCount }} тенге, из них:</div>
            <div v-for="(index,object) in filteredRange.countAllPayments" :key="object">{{ object }}: {{
                index
              }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="type === 'list'" class="list">
        <table class="deadlines__table">
          <thead>
          <tr>
            <th v-for="(header, index) in activeColumns"
                :key="index"
                :class="['table__header affairs-table__header is-descending', { 'is-ascending': activeHeaderIndex === null || (isAscending && activeHeaderIndex === header.field) }]"
                @click="toggleSortDirection(header.field)">({{ header.preview }})
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex" class="affairs-details-tr_table"
              @click="navigateToDetails(row.id)">
            <td v-for="(column, index) in activeColumns"
                :key="`column-${index}`"
                class="affairs-table__row">
              {{ row[column.field] ? row[column.field] : '-' }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <NavItems/>
    </BasicWrapper>
    <Modal v-for="(modal, index) in modalsFilters" :key="index" v-model:isVisible="modal.show">
      <div v-if="index !== 'create'" class="filter__content">
        <input v-model="modal.value" type="text" @keyup.enter="filterSelect(index, modal.show)"/>
        <img alt="" src="../assets/icons/search.png" @keyup.enter="filterSelect(index, modal.show)">
      </div>
    </Modal>
  </section>
</template>

<script>
/* eslint-disable */
import DeadlinesApi from "@/api/DeadlinesApi";
import ExchangeApi from "@/api/ExchangeApi";
import UsersApi from "@/api/UsersApi";
import {toRaw} from "vue";

export default {
  name: 'deadlines-page',
  data() {
    return {
      logo: this.$icons.deadlines,
      burger: this.$icons.burger,
      grid: this.$icons.grid,
      rights: UsersApi.rights,
      userName: UsersApi.name,
      filterDate: new Date(),
      type: 'list',
      rows: {actions: [], accounts: []},
      activeColumns: [],
      columns: [
        {field: 'deadline', preview: 'срок'},
        {field: 'isDeadline', preview: 'рез. срок'},
        {field: 'number', preview: 'номер'},
        {field: 'name', preview: 'объект'},
        {field: 'view', preview: 'вид'},
        {field: 'status', preview: 'статус'},
      ],
      modalsFilters: {
        search: {field: 'поиск', show: false, value: ''},
        view: {field: 'вид', show: false, value: ''},
        object: {field: 'объект', show: false, value: ''},
        client: {field: 'клиент', show: false, value: ''},
        status: {field: 'статус', show: false, value: ''},
      },
      events: {
        '2023-04-20': [{name: 'Мероприятие 1', description: 'Описание мероприятия 1'}],
        '2023-04-22': [{name: 'Мероприятие 2', description: 'Описание мероприятия 2'}, {
          name: 'Мероприятие 3',
          description: 'Описание мероприятия 3'
        }],
      },
      range: {start: 1578290400000, end: 1578636000000},
      selectedRange: {},
      rootItem: null,
      childItem: null,
      item3: null,
      typeCounts: [],
      typeCountsAll: null,
      typeCountsActions: [],
      typeCountsActionsAll: null,
      value: '',
      activeHeaderIndex: null,
      currentFilterType: null,
      isAscending: false,
    }
  },
  mounted() {
    this.loadDeadlines();
    this.activeColumns = this.columns;
    this.setRange();
    ExchangeApi.get();
  },
  methods: {
    loadDeadlines() {
      DeadlinesApi.get().then((response) => {
        if (response.data) {
          this.rows = response.data;
        }
      })
    },
    changeRootItem(event) {
      if (!this.childItem || this.rootItem !== event) {
        this.childItem = event === 'оплаты' ? 'оплачены' : 'кол-во'
        if (!this.item3)
          this.item3 = this.childItem === 'кол-во' ? 'исх. вал' : 'тенге'
      }
      this.rootItem = event;
    },
    changeChildItem(event) {
      this.childItem = event;
      if (!this.item3)
        this.item3 = this.childItem === 'кол-во' ? 'исх. вал' : 'тенге'
    },
    change3Item(event) {
      this.item3 = event;
    },
    setRange() {
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 0, 0, 0, 0);
      const endOfToday = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          23, 59, 59, 999
      );


      this.range = {
        start: startOfMonth.getTime(),
        end: endOfToday.getTime()
      };
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    filterSelect(type, close = false) {
      this.modalsFilters[type].show = !close;
    },
    typeWrapper({name}) {
      this.type = name;
      this.rootItem = null;
      this.childItem = null
      this.item3 = null
    },
    activeItems(items) {
      this.activeColumns = items;
    },
    navigateToDetails(id) {
      this.$router.push(`/affairs/details/${id}`);
    },
    toggleSortDirection(field) {
      if (this.activeHeaderIndex === field) {
        this.isAscending = !this.isAscending;
      } else {
        this.activeHeaderIndex = field;
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
    filteredRange() {
      let rangeStart = new Date(this.range.start);
      rangeStart.setHours(0, 0, 0, 0);
      let rangeEnd = new Date(this.range.end);
      rangeEnd.setHours(0, 0, 0, 0);

      const filteredAccounts = this.rows.accounts.filter(account => {
        const accountDate = new Date(account.date);
        accountDate.setHours(0, 0, 0, 0); // Приведение к началу дня
        return accountDate >= rangeStart && accountDate <= rangeEnd;
      }).sort((a, b) => {
        const dateA = new Date(a.date);
        dateA.setHours(0, 0, 0, 0);
        const dateB = new Date(b.date);
        dateB.setHours(0, 0, 0, 0);
        return dateA - dateB;
      });

      const filteredActions = this.rows.actions.filter(action => {
        const actionDate = new Date(action.created_at);
        actionDate.setHours(0, 0, 0, 0); // Приведение к началу дня
        return actionDate >= rangeStart && actionDate <= rangeEnd;
      }).sort((a, b) => {
        const dateA = new Date(a.created_at);
        dateA.setHours(0, 0, 0, 0);
        const dateB = new Date(b.created_at);
        dateB.setHours(0, 0, 0, 0);
        return dateA - dateB;
      });


      const combinedLogs = filteredActions.reduce((acc, action) => {
        return acc.concat(action.logs);
      }, []);

      const countAllActions = combinedLogs.reduce((acc, log) => {
        const action = log.action;
        if (action) {
          if (acc[action]) {
            acc[action]++;
          } else {
            acc[action] = 1;
          }
        }
        return acc;
      }, {});

      const countAllPayments = filteredAccounts.reduce((acc, payment) => {
        const action = payment.type;
        if (action) {
          if (acc[action]) {
            acc[action]++;
          } else {
            acc[action] = 1;
          }
        }
        return acc;
      }, {});


      const totalPaymentsCount = Object.entries(countAllPayments).reduce((sum, payment) => {
        const amountInTenge = ExchangeApi.convertToTenge(payment[1], payment[0]);
        return sum + amountInTenge;
      }, 0).toFixed(2);

      const countSuccessPayments = filteredAccounts.filter((acc) => acc.state).reduce((acc, payment) => {
        const action = payment.type;
        if (action) {
          if (acc[action]) {
            acc[action]++;
          } else {
            acc[action] = 1;
          }
        }
        return acc;
      }, {});

      const sumSuccessPayments = Object.entries(countSuccessPayments).reduce((sum, payment) => {
        const amountInTenge = ExchangeApi.convertToTenge(payment[1], payment[0]);
        return sum + amountInTenge;
      }, 0).toFixed(2);

      return {
        accounts: filteredAccounts,
        actions: filteredActions,
        countAllActions,
        countAllPayments,
        totalPaymentsCount,
        countActions: combinedLogs.length,
        countSuccessPayments,
        sumSuccessPayments,
        // typeCountsActionsAll,
        // rangeCountsActions,
        // typeCountsAll,
        // rangeTypesOperations
      };
    },
    filteredRows() {
      let result = [...this.rows.actions];
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
                object = toRaw(object);
                if (object[filterType]) {
                  return (Object.entries(object[filterType]).filter(
                      (ob) => {
                        if (ob[0] === 'name') {
                          return ob[1] && ob[1].includes(filterValue);
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
.selected-day {
  background-color: #94ebff;
}

main {
  display: flex;
  justify-content: center;
}

.exit__user-wrapper {
  display: flex;
  justify-content: space-between;
}

.toggle__item {
  width: 68px;
}

.deadlines__info {
  width: unset;
  margin: 4px 45px 0;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  max-width: 32%;
}

.deadlines__info-text {
  display: flex;
  flex-direction: column;
  margin-top: 18px;
  max-width: 350px;
  overflow-y: auto;
}

.deadlines__info-text div + div {
  margin-top: 7px;
}

.deadlines__filters-range .filter__item {
  width: 100%;
}

.toggle {
  width: 100%;
}

.toggle__item {
  width: 50%;
}

.deadlines__toggle {
  margin-top: 10px;
}

.filter__row-container + .filter__row-container {
  margin-top: 7px;
}

.mx-150 {
  max-width: 150px;
}

.affairs-table__row:last-child {
  border: unset;
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

.affairs-table__row {
  width: unset;
}

.d-flex {
  display: flex;
}

.w-100 {
  width: 100%;
}
</style>
