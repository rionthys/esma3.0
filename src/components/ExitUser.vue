<template>
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
</template>

<script>
export default {
  props: {
    name: String,
  },
}
</script>

<style scoped>
.navigate__container {
  display: flex;
  flex-direction: column-reverse;
  position: relative;
}

.navigate__link {
  color: #222222;
  text-decoration: none;
  position: fixed;
  width: 300px;
  transform: translate(-47%, -70px);
}
</style>
