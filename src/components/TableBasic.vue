<template>
    <table :class="customClass">
    <thead>
      <tr>
        <th>срок</th>
        <th>рез. срок</th>
        <th>номер</th>
        <th>объект</th>
        <th>вид</th>
        <th>статус</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in entries" :key="entry.id">
        <td>{{ entry.date }}</td>
        <td>{{ entry.resDate }}</td>
        <td>{{ entry.number }}</td>
        <td>{{ entry.object }}</td>
        <td>{{ entry.type }}</td>
        <td>{{ entry.status }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'table-basic',
    props: {
        customClass: {
            type: String,
            required: false,
        }
    },
  data() {
    return {
      entries: [
        { id: 1, date: '27/07/2020', resDate: 'да', number: '20200310t', object: 'THERR MAITZ', type: 'DR r + ex', status: 'треб. продление' },
        { id: 2, date: '09/10/2020', resDate: 'да', number: '20190811t', object: 'TNT BLAST', type: 'TMap', status: 'треб. оплата' }
      ]
    };
  }
}
</script>