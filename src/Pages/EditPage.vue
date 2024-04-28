<template>
  <section class="content">
    <div class="exit__user-wrapper">
      <div class="filters">
        <div class="filters__row">
          <div class="filter__row-container">
            <div
                class="filter__item"
                @click="saveEntity()">
              cохранить
            </div>
          </div>
        </div>
      </div>
      <ExitUser :name="userName"/>
    </div>
    <BasicWrapper>
      <div class="fields-objects">
        <div v-for="(header, index) in headers" :key="`detail-${index}`" class="detail-field">
          <div class="fields-objects__title"> {{ header['title'] }}</div>
          <div v-if="isFile(rows[header['field']])" class="fields-objects__description">
            <div :class="{ 'is-hidden': !ifPdf(rows[header['field']]) }">
              <div style="cursor: pointer" @click="showDoc(rows[header['field']])">просмотреть документ</div>
              <div style="position: absolute">
                <IframeModal v-model:isVisible="showPdf">
                  <div class="modal-close" @click="closeDoc"><img alt="" src="../assets/icons/cancel.png"></div>
                  <div style="width: 700px; height: 470px">
                    <iframe :key="`${pdfSrc}`"
                            :src="`https://docs.google.com/gview?url=https://echo-cloud.store/upload/${rows[header['field']]}&embedded=true&time=${new Date().getTime()}`"
                            frameborder='0'
                            style="width: 98%; height: 100%"

                    >
                      <p>Ваш браузер не поддерживает загрузку содержимого</p>
                    </iframe>
                  </div>
                </IframeModal>
              </div>
            </div>
            <div v-if="getImg(rows[header['field']])">
              <img :src="getImg(rows[header['field']])" alt="">
            </div>
            <div>
              <input v-if="rights.edit" type="file" @change="handleFileChange($event, header['field'])">
            </div>
          </div>
          <div v-else class="fields-objects__description">
            <div v-if="isBoolean(rows[header['field']], header['field'])">
              <div v-if="!rights.edit">
                {{ rows[header['field']] }}
              </div>
              <input v-else v-model="rows[header['field']]" type="text">
            </div>
            <div v-else-if="isDate(rows[header['field']], header['field']) && rights.edit">
              <input v-model="rows[header['field']]" type="date">
            </div>
            <div v-else-if="isDate(rows[header['field']])">
              {{ rows[header['field']] ? rows[header['field']].split('T')[0] : '-' }}
            </div>
            <input v-else-if="rights.edit && typeof rows[header['field']] === 'string'" v-model="rows[header['field']]"
                   type="text">
            <div v-else-if="typeof rows[header['field']] === 'object'">
              <router-link :to="getUrl(header['field'], rows[header['field']].id)">
                {{ rows[header['field']] ? rows[header['field']].name : '-' }}
              </router-link>
            </div>
            <div v-else>
              {{ rows[header['field']] }}
            </div>
          </div>
        </div>
      </div>
      <NavItems/>
    </BasicWrapper>
  </section>
</template>

<script>
import DatabaseObjectApi from '../api/DatabaseObjectApi';
import UsersApi from "@/api/UsersApi";
import UploadApi from "@/api/UploadApi";
import AffairsApi from "@/api/AffairsApi";
import MailsRegisteryApi from "@/api/MailsRegisteryApi";
import ContractsApi from "@/api/ContractsApi";
import DocumentsApi from "@/api/DocumentsApi";
import AccountsApi from "@/api/AccountsApi";
import ClientsApi from "@/api/ClientsApi";
import IframeModal from "@/components/IFrameModal.vue";

export default {
  name: 'database-page',
  components: {IframeModal},
  data() {
    return {
      year: '',
      search: '',
      affairs: '',
      logo: this.$icons.database,
      rights: UsersApi.rights,
      userName: UsersApi.name,
      headers: [],
      imgExtensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'],
      fileExtensions: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'pdf', 'ods', 'odp'],
      rows: {},
      apiMapping: {
        database: DatabaseObjectApi,
        affairs: AffairsApi,
        'mails-register': MailsRegisteryApi,
        contracts: ContractsApi,
        documents: DocumentsApi,
        accounts: AccountsApi,
        client: ClientsApi
      },
      showPdf: false,
      pdfSrc: null,
    }
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    '$route.params.id': async function () {
      await this.fetchData();
    },
    // Отслеживаем изменения параметра 'type' в маршруте
    '$route.params.type': async function () {
      await this.fetchData();
    }
  },
  methods: {
    fetchData() {
      this.headers = this.$edit[this.$route.params.type];

      this.apiMapping[this.$route.params.type].getById(this.$route.params.id).then((response) => {
        if (response) {
          this.rows = response.data;
        }
      })
      setTimeout(() => this.pdfSrc = 1500, 1500);
    },
    isBoolean(state, field) {
      if (typeof state === 'boolean')
        this.rows[field] = state ? 'да' : 'нет';
      return typeof state === 'boolean';
    },
    isDate(dateString, field) {
      if (dateString, field) {
        const date = new Date(dateString);
        const response = !isNaN(date.getTime());
        this.rows[field] = response && typeof dateString === 'string' ? dateString.split('T')[0] : dateString;
        return response;
      }
    },
    getImg(filename) {
      let response = false;
      const isImg = typeof filename === 'string' ? this.imgExtensions.some(extension => filename.split('.').pop().toLowerCase() === extension) : false;
      if (isImg) {
        response = filename.split('http').length > 1 ? filename : `https://echo-cloud.store/upload/${filename}`;
      }
      return response;
    },
    getUrl(type, id) {
      return `/edit/${type}/${id}`;
    },
    isFile(filename) {
      let response = false;
      if (filename) {
        const allExtensions = [...this.imgExtensions, ...this.fileExtensions]
        response = typeof filename === 'string' ? allExtensions.some(extension => filename.split('.').pop().toLowerCase() === extension) : false;
      }
      return response;
    },
    ifPdf(filename) {
      let response = false;
      if (filename) {
        const allExtensions = ['pdf'];
        response = typeof filename === 'string' ? allExtensions.some(extension => filename.split('.').pop().toLowerCase() === extension) : false;
      }
      return response;
    },
    closeDoc() {
      this.showPdf = false;
    },
    showDoc(src) {
      this.showPdf = true;
      this.pdfSrc = src;
    },
    handleFileChange(event, field) {
      const file = event.target.files[0];
      if (file) {
        UploadApi.upload(file).then((response) => {
          if (response.data) {
            this.rows[field] = response.data.fileName;
          }
        })

        event.target.value = null;
      }
    },
    saveEntity() {
      this.apiMapping[this.$route.params.type].update(this.$route.params.id, {...this.rows, user: UsersApi.id})
    }
  }
}
</script>

<style scoped>
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

.filters {
  margin: 0;
}

.is-hidden {
  display: none;
}

a {
  color: #000;
  text-decoration: none;
}
</style>
