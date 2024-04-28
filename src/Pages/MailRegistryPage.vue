<template>
  <section class="content">
    <div class="exit__user-wrapper">
      <LogoPage :logo="logo" title="реестр почты"/>
      <div class="filters">
        <div class="filters__row">
          <div class="filter__row-container">
            <div v-for="(modal, index) in modalsFilters"
                 :key="`show-${index}`">
              <div v-if="index !== 'create' && index !== 'type'" class="filter__item"
                   @click="filterSelect(index)">
                {{ modal.field }}
              </div>
              <div v-else-if="rights.create && index === 'create'" class="filter__item" @click="filterSelect(index)">
                {{ modal.field }}
              </div>
            </div>
          </div>
        </div>
        <div class="filters__row">
          <div class="filter__row-container">
            <div class="mx-300">
              <Toggle :isFilter="true" :items="['входящие', 'исходящие', 'все']"
                      @item-selected="filterToggle($event)"/>
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
          <th class="table__header affairs-table__header"></th>
          <th v-for="(header, index) in headers"
              :key="index"
              class="table__header affairs-table__header">{{ header }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(row, rowIndex) in filteredRows" :key="rowIndex"
            class="affairs-details-tr_table"
            @mouseleave="hideTooltip"
            @mousemove="updateTooltip($event)"
            @mouseover="showTooltip($event, row.address)"
            @contextmenu.prevent="openContextMenu($event, row.id)"
        >
          <td class="affairs-table__row">
            <img v-if="row.type === 'исходящее'" alt="исходящее" class="rotate" src="../assets/icons/arrow.png">
            <img v-if="row.type === 'входящее'" alt="входящее" src="../assets/icons/arrow.png">
            <div v-if="row.type === 'переписка'">@</div>
          </td>
          <td class="affairs-table__row">{{ row.number ? row?.number : '-' }}</td>
          <td class="affairs-table__row">{{ row.services ? row?.services : '-' }}</td>
          <td class="affairs-table__row">{{ row.date ? row?.date.split('T')[0] : '-' }}</td>
          <td class="affairs-table__row">{{ row.destination ? row.destination : '-' }}</td>
          <td class="affairs-table__row"><a @click="navigateToAffairs(row?.affair?.id)">{{ row?.affair?.number }}: </a>{{
              row?.content
            }}
          </td>
        </tr>
        </tbody>
        <div v-if="tooltip.visible" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }" class="tooltip">
          {{ tooltip.content }}
        </div>
      </table>
      <DeleteItem :position="menuPosition" :visible="menuVisible" entity="запись" @deleteCase="deleteCase"
                  @editCase="editCase"/>
      <NavItems/>
    </BasicWrapper>
    <Modal v-for="(modal, index) in modalsFilters" :key="index" v-model:isVisible="modal.show">
      <div v-if="index !== 'create' && index !== 'type'" class="filter__content">
        <input v-model="modal.value" type="text" @keyup.enter="filterSelect(index, modal.show)"/>
        <img alt="" src="../assets/icons/search.png" @keyup.enter="filterSelect(index, modal.show)">
      </div>
    </Modal>
    <MailsRegisteryCreateModal v-model:show="modalsFilters.create.show" @add-mail="loadMails"/>
  </section>
</template>

<script>
import MailsRegisteryApi from "@/api/MailsRegisteryApi";
import UsersApi from "@/api/UsersApi";
import MailsRegisteryCreateModal from "@/Blocks/MailsRegisteryCreateModal.vue";
import DeleteItem from "@/components/DeleteItem.vue";
import DatabaseObjectApi from '../api/DatabaseObjectApi';
import {toRaw} from "vue";

export default {
  name: 'database-page',
  components: {
    MailsRegisteryCreateModal,
    DeleteItem
  },
  data() {
    return {
      currentFilterType: null,
      logo: this.$icons.mailsRegistry,
      modalUpdate: false,
      modalsFilters: {
        search: {field: 'поиск', show: false, value: ''},
        date: {field: 'год', show: false, value: ''},
        affair: {field: 'дело', show: false, value: ''},
        object: {field: 'объект', show: false, value: ''},
        client: {field: 'клиент', show: false, value: ''},
        create: {field: 'создать', show: false, value: ''},
        type: {value: 'входящее'},
      },
      rights: UsersApi.rights,
      userName: UsersApi.name,
      menuVisible: false,
      menuPosition: {x: 0, y: 0},
      tooltip: {
        visible: false,
        content: '',
        x: 0,
        y: 0,
      },
      contextId: null,
      headers: ['трек-номер', 'служба', 'дата', 'адресат', 'содержание'],
      rows: [],
    }
  },
  mounted() {
    this.loadMails();
  },
  methods: {
    loadMails() {
      MailsRegisteryApi.get().then((response) => {
        if (response) {
          this.rows = response.data;
        }
      })
    },
    filterSelect(type, close = false) {
      this.modalsFilters[type].show = !close;
      this.currentFilterType = !close ? type : null;
    },
    navigateToAffairs(id) {
      this.$router.push(`/affairs/details/${id}`);
    },
    editCase() {
      this.$router.push({path: `/edit/mails-register/${this.contextId}`});
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
      await MailsRegisteryApi.delete(this.contextId);
      this.loadMails();
      this.closeContextMenu();
    },
    hideTooltip() {
      this.tooltip.visible = false;
    },
    showTooltip(event, content) {
      this.tooltip.visible = true;
      this.tooltip.content = content;
      this.updateTooltip(event)
    },
    updateTooltip(event) {
      this.tooltip.x = event.clientX + 15;
      this.tooltip.y = event.clientY;
    },
    filterToggle(event) {
      if (event === 'все') {
        this.modalsFilters = {
          ...this.modalsFilters,
          type: {
            value: ''
          }
        };
      } else if (event === 'входящие') {
        this.modalsFilters = {
          ...this.modalsFilters,
          type: {
            value: 'входящее'
          }
        };
      } else if (event === 'исходящие') {
        this.modalsFilters = {
          ...this.modalsFilters,
          type: {
            value: 'исходящее'
          }
        };
      } else {
        this.modalsFilters = {
          ...this.modalsFilters,
          type: {
            value: event
          }
        };
      }
    },
    async selectedAffair(affair) {
      this.modalUpdate = false;
      await DatabaseObjectApi.addAffairs(this.contextId, {affair: affair.id})
      this.loadMails();
    }
  },
  computed: {
    filteredRows() {
      let result = [...this.rows];
      Object.keys(this.modalsFilters).forEach((filterType) => {
        const filterValue = typeof this.modalsFilters[filterType].value === 'string' ?
            this.modalsFilters[filterType].value.toLowerCase()
            : this.modalsFilters[filterType].value;
        if (filterValue) {
          console.log('result', result);
          result = result.filter((object) => {
            {
              object = toRaw(object);
              if (typeof object[filterType] === "object") {
                if (object[filterType]) {
                  return (Object.entries(object[filterType]).filter(
                      (ob) => {
                        console.log(ob);
                        if (ob[0] === 'name') {
                          return ob[1] && ob[1].includes(filterValue);
                        }
                      }
                  )).length > 0;
                } else {
                  return false;
                }
              } else if (filterType === 'affairs' || filterType === 'object' || filterType === 'type' || filterType === 'status'
                  || filterType === 'client' || filterType === 'date') {
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
.tooltip {
  position: fixed;
  padding: 10px;
  background-color: white;
  color: black;
  border-radius: 5px;
  max-width: 200px;
  box-shadow: 0px 0px 10px 0px rgba(75, 75, 75, 0.8);
  transition: all 0.3s ease;
}

main {
  display: flex;
  justify-content: center;
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

img {
  width: 18px;
  vertical-align: middle;
}

.mx-300 {
  max-width: 300px;
}

.rotate {
  transform: rotateY(180deg);
}

.affairs-table__row {
  width: unset;
}

a {
  color: blue;
  cursor: pointer;
}
</style>
