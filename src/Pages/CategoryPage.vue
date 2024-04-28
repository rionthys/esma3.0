<template>
  <section class="content">
    <div class="exit__user-wrapper">
      <ExitUser :name="userName"/>
    </div>
    <CategoriesNav />
    <div></div>
  </section>
</template>

<script>
import UsersApi from "@/api/UsersApi";

export default {
    name: 'category-page',
    data() {
      return {
        rights: UsersApi.rights,
        userName: UsersApi.name,
      }
    },
  }
</script>

<style>
  main {
    display: flex;
    justify-content: center;
  }

  .exit__user-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .category__content {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-evenly;
  }
</style>
