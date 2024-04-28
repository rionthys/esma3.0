<template>
  <div :class="large ? 'category__item text-align' : 'category__item'">
    <div class="category__item-img">
      <img :class="large ? 'large' : ''" :src="logo" alt="базы данных" />
    </div>
    <div class="category__item-title">{{ title }}</div>
  </div>
</template>

<script>
  export default {
    props: {
      logo: {
        type: String,
        required: true,
      },
      large: {
        type: Boolean,
        required: false,
      },
      title: {
        type: String,
        required: true,
      },
    },
  }
</script>

<style scoped>
  .category__item-img img {
    width: 48px;
  }

  .category__item-img .large {
    width: 42px;
  }

  .text-align {
    width: 80px;
    text-align: center;
  }

  .category__item-title {
    font-size: 16px;
    margin-top: 10px;
  }

  .category__item {
    width: 64px;
  }

  @media (min-width: 1440px) {
    .category__item-img img {
      width: 64px;
    }
    .category__item-title {
      font-size: 20px;
      margin-top: 10px;
    }
  }
</style>
