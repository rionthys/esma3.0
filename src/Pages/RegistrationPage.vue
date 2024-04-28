<template>
  <div id="wrapper">
    <main>
      <div class="navigate__container">
        <div class="exit__user-btn">
          <span>{{ name }}</span>
          <router-link to="/">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M13.5,5.5C14.59,5.5 15.5,4.58 15.5,3.5C15.5,2.38 14.59,1.5 13.5,1.5C12.39,1.5 11.5,2.38 11.5,3.5C11.5,4.58 12.39,5.5 13.5,5.5M9.89,19.38L10.89,15L13,17V23H15V15.5L12.89,13.5L13.5,10.5C14.79,12 16.79,13 19,13V11C17.09,11 15.5,10 14.69,8.58L13.69,7C13.29,6.38 12.69,6 12,6C11.69,6 11.5,6.08 11.19,6.08L6,8.28V13H8V9.58L9.79,8.88L8.19,17L3.29,16L2.89,18L9.89,19.38Z"
              />
            </svg>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <title>выход</title>
              <path d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z"/>
            </svg>
          </router-link>
        </div>
        <router-link class="navigate__link" to="/rights-manager">управление пользователями</router-link>
      </div>
      <div class="authentication">
        <input
            ref="nameInput"
            v-model="name"
            class="authentication__input"
            placeholder="имя"
            type="text"
            @input="resetValidate"
            @keyup.enter="focusNextFromName"
            @keydown.down="focusNextFromName"
        />
        <input
            ref="loginInput"
            v-model="login"
            :class="{ authentication__input: true, error: !loginValid }"
            placeholder="логин"
            type="text"
            @input="resetValidate"
            @keyup.enter="loginEnterPress"
            @keydown.down="focusNext"
            @keydown.up="focusPrev"
        />
        <input
            ref="passwordInput"
            v-model="password"
            :class="{ authentication__input: true, error: !passwordValid }"
            placeholder="пароль"
            type="password"
            @input="resetValidate"
            @keyup.enter="validateUser"
            @keydown.up="focusPrev"
        />
      </div>
    </main>
  </div>
</template>

<script>
import UsersApi from '../api/UsersApi';

export default {
  name: 'auth-page',
  data() {
    return {
      login: '',
      password: '',
      name: '',
      loginValid: true,
      passwordValid: true,
    }
  },
  methods: {
    async validateUser() {
      const users = await UsersApi.registration({name: this.name, login: this.login, password: this.password});
      UsersApi.isAuth = users.data.auth
      UsersApi.name = users.data.name
      UsersApi.id = users.data.id
      UsersApi.rights = users.data.rights
      this.$router.push({path: '/category/'})
    },
    resetValidate() {
      this.loginValid = true
      this.passwordValid = true
    },
    loginEnterPress() {
      this.$refs.passwordInput.focus()
    },
    focusNextFromName() {
      this.$refs.loginInput.focus();
    },
    focusNext() {
      this.$refs.passwordInput.focus()
    },
    focusPrev() {
      if (document.activeElement === this.$refs.passwordInput) {
        this.$refs.loginInput.focus()
      }
    },
  },
}
</script>

<style scoped>
.exit__user-btn {
  background-color: transparent;
  border: unset;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.navigate__container {
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
}

.navigate__link {
  color: #222222;
  text-decoration: none;
  position: absolute;
  top: -33px;
  transform: translateX(-75%);
  text-wrap: nowrap;
}
</style>