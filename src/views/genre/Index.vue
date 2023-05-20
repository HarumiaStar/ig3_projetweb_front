<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { errorNotif } from '../../utils/notification'
import { User } from '../../utils/user'

const data = ref([])
const router = useRouter()

function getData() {
  fetch(import.meta.env.VITE_API_URL + "genres", User.generateHeaders())
    .then(async (res) => {
      const json = await res.json()
      if (res.ok) return json
      else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({ name: "genreIndex" })
      }
    })
    .then(json => (data.value = json))
}

function supprimer(id) {
  const optionRequest = User.generateHeaders()
  optionRequest.method = 'DELETE'
  console.log(id)
  fetch(import.meta.env.VITE_API_URL + "genres/" + id, optionRequest)
    .then(async (res) => {
      const json = await res.json()
      if (res.ok) return getData()
      else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({ name: "genreIndex" })
      }
    })
    .catch(() => (getData()))
}

getData() // On charge les données au chargement de la page

</script>

<template>
  <h1>Les Genres</h1>
  <RouterLink :to="{ name: 'genreCreate' }"><o-button variant="primary">➕ Ajouter un genre</o-button></RouterLink>

  <o-table :data="data">

    <o-table-column field="title" label="Titre" searchable sortable v-slot:default="props">
      {{ props.row.title }}
    </o-table-column>

    <o-table-column field="created_at" label="Créé le :" v-slot:default="props">
      {{ new Date(props.row.created_at).toLocaleString() }}
    </o-table-column>

    <o-table-column field="updated_at" label="Mise à jour le :" v-slot:default="props">
      {{ new Date(props.row.updated_at).toLocaleString() }}
    </o-table-column>

    <o-table-column field="action" label="Action" v-slot:default="props">
      <RouterLink :to="{name: 'genreRead', params:{id: props.row._id}}" class="button is-info">
          Voir
        </RouterLink>
      
      <RouterLink :to="{ name: 'genreEdit', params: { id: props.row._id } }" class="button is-warning">
        Editer
      </RouterLink>

      <div class="button is-danger" @click="supprimer(props.row._id)">Supprimer</div>
    </o-table-column>

  </o-table>
</template>