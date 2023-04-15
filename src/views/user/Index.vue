<script setup lang="ts">

import { ref } from 'vue'
const data = ref([])

fetch(import.meta.env.VITE_API_URL + "users")
    .then((res) => res.json())
    .then((json) => data.value = json)
    .catch((err) => console.log(err))
</script>

<template>
    <h1>Les Utilisateurs</h1>
       
    <o-table :data="data">
        <o-table-column field="_id" label="ID" numeric v-slot:default="props">
          {{ props.row._id }}
        </o-table-column>
        
        <o-table-column field="name" label="Prénom" numeric v-slot:default="props">
          {{ props.row.name }}
        </o-table-column>
        
        <o-table-column field="first_name" label="Nom" numeric v-slot:default="props">
          {{ props.row.first_name }}
        </o-table-column>
        
        <o-table-column field="email" label="Email" numeric v-slot:default="props">
          {{ props.row.email }}
        </o-table-column>
        
        <o-table-column field="birthday" label="Date de Naissance" numeric v-slot:default="props">
          {{ new Date(props.row.birthday).toLocaleDateString() }}
        </o-table-column>
        
        <o-table-column field="city" label="Ville" numeric v-slot:default="props">
          {{ props.row.city }}
        </o-table-column>
        
        <o-table-column field="created_at" label="Créé le :" numeric v-slot:default="props">
          {{ new Date(props.row.created_at).toLocaleString() }}
        </o-table-column>
        
        <o-table-column field="updated_at" label="Mise à jour le :" numeric v-slot:default="props">
          {{ new Date(props.row.updated_at).toLocaleString() }}
        </o-table-column>
        
        <o-table-column field="is_admin" label="Administrateur" numeric v-slot:default="props">
          {{ props.row.is_admin === false ? "✖️" : "✔️"}}
        </o-table-column>
   
    </o-table>
</template>