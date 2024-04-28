<template>
  <div>
    <h2>Управление ролями</h2>
    <div>
      <input v-model="newRole.name" placeholder="Название роли">
      <label><input v-model="newRole.permissions.read" type="checkbox"> Чтение</label>
      <label><input v-model="newRole.permissions.write" type="checkbox"> Запись</label>
      <label><input v-model="newRole.permissions.delete" type="checkbox"> Удаление</label>
      <button @click="addRole">Добавить роль</button>
    </div>

    <h3>Существующие роли</h3>
    <ul>
      <li v-for="(role, index) in roles" :key="index">
        {{ role.name }} - Права: {{ role.permissions | permissionNames }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newRole: {
        name: '',
        permissions: {
          read: false,
          write: false,
          delete: false,
        },
      },
      roles: [],
    };
  },
  methods: {
    addRole() {
      this.roles.push({...this.newRole});
      this.newRole = {name: '', permissions: {read: false, write: false, delete: false}};
      // Здесь должен быть код для отправки роли на сервер
    },
  },
};
</script>
