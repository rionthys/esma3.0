<template>
  <div id="wrapper">
    <main>
      <div class="authentication">
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
        <div class="register" @click="navigateToRegister()">Зарегистрироваться ?</div>
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
      loginValid: true,
      passwordValid: true,
    }
  },
  methods: {
    async validateUser() {
      const users = await UsersApi.auth({login: this.login, password: this.password});
      UsersApi.isAuth = users.data.auth
      UsersApi.name = users.data.name
      UsersApi.id = users.data.id
      UsersApi.rights = users.data.rights
      this.$router.push({path: '/category/'});
    },
    resetValidate() {
      this.loginValid = true
      this.passwordValid = true
    },
    loginEnterPress() {
      this.$refs.passwordInput.focus()
    },
    focusNext() {
      this.$refs.passwordInput.focus()
    },
    focusPrev() {
      if (document.activeElement === this.$refs.passwordInput) {
        this.$refs.loginInput.focus()
      }
    },
    navigateToRegister() {
      this.$router.push({path: '/register/'})
    }
  },
}
</script>


<style scoped>
.register {
  cursor: pointer;
  margin-top: 10px;
}
</style>
