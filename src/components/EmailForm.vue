<template>
  <div class="email-form-container">
    <form class="mail-form" @submit.prevent="sendEmail">
      <div class="mail-field">
        <label for="to">To:</label>
        <input id="to" v-model="email.to" required type="email">
      </div>

      <div class="mail-field">
        <label for="cc">CC:</label>
        <input id="cc" v-model="email.cc" type="email">
      </div>

      <div class="mail-field">
        <label for="subject">Subject:</label>
        <input id="subject" v-model="email.subject" required type="text">
      </div>

      <div class="mail-editor">
        <quill-editor v-model:value="email.html"
                      :options="email.editorOption"
                      class="editor"
        />
      </div>

      <div class="filter__row-container">
        <div v-if="contextObject" @click="showDoc">
          <img alt=""
               src="../assets/icons/doc-black.png">
        </div>
        <div class="filter__item" style="margin-left: 25px" @click="sendEmail">
          Отправить
        </div>
      </div>
      <IframeModal v-model:isVisible="showPdf">
        <div class="modal-close" @click="closeDoc"><img alt="" src="../assets/icons/cancel.png"></div>
        <div style="width: 700px; height: 470px">
          <iframe :key="`${pdfSrc}`"
                  :src="`https://docs.google.com/gview?url=https://echo-cloud.store/upload/${ pdfSrc ? pdfSrc : ''}&embedded=true&time=${new Date().getTime()}`"
                  frameborder='0'
                  style="width: 98%; height: 100%"

          >
            <p>Ваш браузер не поддерживает загрузку содержимого</p>
          </iframe>
        </div>
      </IframeModal>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import {quillEditor} from 'vue3-quill'
import IframeModal from "@/components/IFrameModal.vue";

export default {
  components: {
    IframeModal,
    quillEditor
  },
  props: {
    contextObject: String,
  },
  data() {
    return {
      email: {
        to: '',
        cc: '',
        subject: '',
        html: '',
        editorOption: {
          placeholder: 'Cодержание письма....',
          modules: {},
        },
        disabled: false,
      },
      showPdf: false,
      pdfSrc: null,
    };
  },
  mounted() {
    setTimeout(() => this.pdfSrc = 1500, 1500);
  },
  methods: {
    showDoc() {
      if (this.contextObject) {
        console.log(this.contextObject)
        this.showPdf = true;
        this.pdfSrc = this.contextObject;
      }
    },
    closeDoc() {
      this.showPdf = false;
    },
    async sendEmail() {

      const mailData = {
        to: this.email.to,
        cc: this.email.cc,
        subject: this.email.subject,
        content: this.email.html,
        pdf: this.contextObject,
      };

      await axios.post('https://echo-cloud.store/api/mail', mailData);
      this.$emit('close-modal')
    }
  }
};
</script>

<style scoped>
.email-form-container {
  font-family: 'Helvetica', 'Arial', sans-serif;
  padding: 16px;
  background-color: white;
  border: 1px solid black;
  height: 100%;
}

.mail-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mail-field {
  margin-bottom: 10px;
  display: flex;
  border-bottom: 1px solid gray;
}

.mail-field label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #bbb;
}

.mail-field input[type="email"],
.mail-field input[type="text"] {
  width: 100%;
  font-size: 14px;
  border: unset;
  margin-left: 10px;
}

.editor {
  border: 1px solid #ced4da;
  border-radius: 4px;
  /* При необходимости добавьте дополнительные стили для редактора */
}

.mail-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

button[type="submit"] {
  padding: 10px 15px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.filter__row-container {
  margin-top: 12px;
}

img {
  width: 24px;
}
</style>
