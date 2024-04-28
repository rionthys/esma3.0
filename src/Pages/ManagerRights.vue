<template>
  <section class="content">
    <div class="exit__user-wrapper">
      <LogoPage :logo="logo" title="пользователи"/>
      <div class="filters">
        <div class="filters__row">
          <div class="filter__row-container">
            <div class="filter__toggle">
              <Toggle :items="['категории', 'действия']" @item-selected="changeTab($event)"/>
            </div>
          </div>
          <div class="filter__row-container">
            <div v-for="(modal, index) in modalsFilters" :key="`show-${index}`"
                 class="filter__item"
                 @click="saveRights()">
              {{ modal.field }}
            </div>
          </div>
        </div>
      </div>
      <ExitUser :name="userName"/>
    </div>
    <BasicWrapper>
      <table v-if="tab === 'категории'" class="database__table">
        <thead>
        <tr>
          <th v-for="(header, index) in headers"
              :key="index"
              class="table__header affairs-table__header">
            <div v-if="header === 'имя'" class="jsc">{{ header }}</div>
            <div v-else class="jsc"><img :src="header"/></div>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="affairs-details-tr_table"
            @contextmenu.prevent="openContextMenu($event, row.id)">
          <td class="affairs-table__row">
            <div class="jsc">
              {{ row.name ? row.name : '-' }}
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              <label class="container">
                <input v-model="row.rights.database" type="checkbox">
                <div class="checkmark"></div>
              </label>
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              <label class="container">
                <input v-model="row.rights.affairs" type="checkbox">
                <div class="checkmark"></div>
              </label>
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              <label class="container">
                <input v-model="row.rights.mailsRegistery" type="checkbox">
                <div class="checkmark"></div>
              </label>
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              <label class="container">
                <input v-model="row.rights.mail" type="checkbox">
                <div class="checkmark"></div>
              </label>
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              <label class="container">
                <input v-model="row.rights.deadlines" type="checkbox">
                <div class="checkmark"></div>
              </label>
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              <label class="container">
                <input v-model="row.rights.contracts" type="checkbox">
                <div class="checkmark"></div>
              </label>
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              <label class="container">
                <input v-model="row.rights.documents" type="checkbox">
                <div class="checkmark"></div>
              </label>
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              <label class="container">
                <input v-model="row.rights.accounts" type="checkbox">
                <div class="checkmark"></div>
              </label>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <table v-if="tab === 'действия'" class="database__table">
        <thead>
        <tr>
          <th v-for="(header, index) in ['имя', 'создавать', 'редактировать', 'удалять']"
              :key="index"
              class="table__header affairs-table__header">
            <div class="jsc">{{ header }}</div>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="affairs-details-tr_table"
            @contextmenu.prevent="openContextMenu($event, row.id)">
          <td class="affairs-table__row">
            <div class="jsc">
              {{ row.name ? row.name : '-' }}
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              <label class="container">
                <input v-model="row.rights.create" type="checkbox">
                <div class="checkmark"></div>
              </label>
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              <label class="container">
                <input v-model="row.rights.edit" type="checkbox">
                <div class="checkmark"></div>
              </label>
            </div>
          </td>
          <td class="affairs-table__row">
            <div class="jsc">
              <label class="container">
                <input v-model="row.rights.delete" type="checkbox">
                <div class="checkmark"></div>
              </label>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <NavItems/>
    </BasicWrapper>
    <DeleteItem :position="menuPosition" :visible="menuVisible" entity="пользователя" @deleteCase="deleteCase"/>
  </section>
</template>

<script>
import UsersApi from "@/api/UsersApi";
import DeleteItem from '@/components/DeleteItem.vue';
import {eventBus} from "@/events/eventBus";

export default {
  name: 'affairs-page',
  components: {DeleteItem},
  data() {
    return {
      logo: this.$icons.users,
      isAscending: false,
      userName: UsersApi.name,
      modalsFilters: {
        create: {field: 'сохранить', show: false, value: ''},
      },
      headers: ['имя', this.$icons.database, this.$icons.affairs, this.$icons.mailsRegistry, this.$icons.mail, this.$icons.deadlines, this.$icons.contracts, this.$icons.documents, this.$icons.accounts],
      headersKey: ['number', 'object', 'view', 'status', 'deadline'],
      rows: [],
      menuVisible: false,
      menuPosition: {x: 0, y: 0},
      activeHeaderIndex: null,
      currentFilterType: null,
      tab: 'категории',
    }
  },
  mounted() {
    this.loadAffairs();
  },
  methods: {
    loadAffairs() {
      UsersApi.get().then((response) => {
        if (response) {
          console.log(response.data);
          this.rows = response.data.map((row) => {
            const rights = row.rights ?? {};
            return {
              id: row.id,
              name: row.name,
              rights: {
                database: rights !== null && rights !== undefined && rights.database !== undefined && rights.database === true,
                affairs: rights !== null && rights !== undefined && rights.affairs !== undefined && rights.affairs === true,
                mailsRegistery: rights !== null && rights !== undefined && rights.mailsRegistery !== undefined && rights.mailsRegistery === true,
                mail: rights !== null && rights !== undefined && rights.mail !== undefined && rights.mail === true,
                deadlines: rights !== null && rights !== undefined && rights.deadlines !== undefined && rights.deadlines === true,
                contracts: rights !== null && rights !== undefined && rights.contracts !== undefined && rights.contracts === true,
                documents: rights !== null && rights !== undefined && rights.documents !== undefined && rights.documents === true,
                accounts: rights !== null && rights !== undefined && rights.accounts !== undefined && rights.accounts === true,
                create: rights !== null && rights !== undefined && rights.create !== undefined && rights.create === true,
                edit: rights !== null && rights !== undefined && rights.edit !== undefined && rights.edit === true,
                delete: rights !== null && rights !== undefined && rights.delete !== undefined && rights.delete === true,
              },
            }
          })
          console.log(this.rows);
        }
      })
    },
    filterSelect(type, close = false) {
      this.modalsFilters[type].show = !close;
    },
    navigateToDetails(id) {
      this.$router.push(`/affairs/details/${id}`);
    },
    changeTab(tab) {
      this.tab = tab;
    },
    openContextMenu(event, id) {
      this.menuPosition = {x: event.clientX, y: event.clientY};
      this.menuVisible = true;
      this.contextId = id;
      window.addEventListener('click', this.closeContextMenu);
    },
    handleAddCase() {
      this.modalUpdate = true;
      this.closeContextMenu();
    },
    closeContextMenu() {
      this.menuVisible = false;
      window.removeEventListener('click', this.closeContextMenu);
    },
    async deleteCase() {
      await UsersApi.delete(this.contextId);
      this.loadAffairs();
      this.closeContextMenu();
    },
    saveRights() {
      console.log(this.rows);
      this.rows.forEach((user) => {
        console.log(user.rights)
        UsersApi.setRights(user.id, user.rights).then((response) => {
          if (response.data && user.id === UsersApi.id) {
            UsersApi.rights = user.rights;
            eventBus.emit('rightsUpdated', user.rights);
          }
        });
      })
    }
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
  justify-content: flex-end;
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

th {
  font-size: 20px;
}

.jsc {
  display: flex;
  justify-content: center;
}

.jsc input {
  width: 16px;
  height: 16px;
}

.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.container {
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 1rem;
  user-select: none;
}

.checkmark {
  --clr: #fff;
  position: relative;
  top: 0;
  left: 0;
  height: 1em;
  width: 1em;
  background-color: #fff;
  border: 1px solid #000;
}

.container input:checked ~ .checkmark {
  background-color: var(--clr);
  border: 1px solid #000;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.container input:checked ~ .checkmark:after {
  display: block;
}

.container .checkmark:after {
  left: 0.25em;
  top: 0.15em;
  width: 0.2em;
  height: 0.4em;
  border: solid #000;
  border-width: 0 0.15em 0.15em 0;
  transform: rotate(45deg);
}

@media (min-width: 1440px) {
  .filters {
    justify-content: center;
    height: 68px;
  }
}
</style>
