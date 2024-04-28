<template>
  <div class="email-form-container">
    <form @submit.prevent="sendEmail">
      <label for="to">Кому:</label>
      <input id="to" v-model="email.to" required type="email">

      <label for="cc">Копия:</label>
      <input id="cc" v-model="email.cc" type="email">

      <label for="subject">Тема:</label>
      <input id="subject" v-model="email.subject" required type="text">

      <label for="body">Сообщение:</label>
      <textarea id="body" v-model="email.body" required></textarea>

      <button type="submit">Отправить</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: {
        to: '',
        cc: '',
        subject: '',
        body: ''
      },
    };
  },
  methods: {
    async sendEmail() {
      await this.axios.post('/send-email', this.email);
    }
  }
};
</script>

<style>
/* Добавьте стилизацию сюда */
</style>
