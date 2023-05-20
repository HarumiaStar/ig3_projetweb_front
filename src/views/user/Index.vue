<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { User } from '../../utils/user'
import { errorNotif } from '../../utils/notification'

const data = ref([])
const router = useRouter()

function getData(){
  fetch(import.meta.env.VITE_API_URL + "users", User.generateHeaders())
  .then((res) => res.json())
  .then((json) => data.value = json)
  .catch((err) => console.log(err))
}

function supprimer(id){
  const optionRequest = User.generateHeaders()
  optionRequest.method = 'DELETE'
  console.log(id)
  fetch(import.meta.env.VITE_API_URL + "users/" + id, optionRequest)
  .then(async (res)=> {
    const json = await res.json()
    if (res.ok) return getData()
    else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({name: "userLogin"})
      }
  })
  .catch(()=> (getData()))
}

getData()
</script>

<template>
    <h1>Les Utilisateurs</h1>
       
    <o-table :data="data">
        
        <o-table-column searchable sortable field="name" label="Prénom" v-slot:default="props">
          {{ props.row.name }}
        </o-table-column>
        
        <o-table-column searchable sortable field="first_name" label="Nom" v-slot:default="props">
          {{ props.row.first_name }}
        </o-table-column>
        
        <o-table-column searchable sortable field="email" label="Email" v-slot:default="props">
          {{ props.row.email }}
        </o-table-column>

        <o-table-column searchable sortable field="city" label="Ville" v-slot:default="props">
          {{ props.row.city }}
        </o-table-column>
        
        <o-table-column sortable field="birthday" label="Date de Naissance" v-slot:default="props">
          {{ new Date(props.row.birthday).toLocaleDateString() }}
        </o-table-column>
        
        <o-table-column field="created_at" label="Créé le :" v-slot:default="props">
          {{ new Date(props.row.created_at).toLocaleString() }}
        </o-table-column>
        
        <o-table-column field="updated_at" label="Mise à jour le :" v-slot:default="props">
          {{ new Date(props.row.updated_at).toLocaleString() }}
        </o-table-column>
        
        <o-table-column field="is_admin" label="Administrateur" v-slot:default="props">
          {{ props.row.is_admin === false ? "✖️" : "✔️"}}
        </o-table-column>


        <o-table-column field="action" label="Action" v-slot:default="props">
          <RouterLink :to="{name: 'userRead', params:{id: props.row._id}}" class="button is-info">
                  Voir
          </RouterLink>
          
          <RouterLink :to="{name: 'userEdit', params:{id: props.row._id}}" class="button is-warning">
                  Editer
          </RouterLink>

          <div class="button is-danger" @click="supprimer(props.row._id)">Supprimer</div>
        </o-table-column>
   
    </o-table>
</template>