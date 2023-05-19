<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { errorNotif } from '../../utils/notification'
import { User } from '../../utils/user'

const data = ref([])
const router = useRouter()

function getData() {
  fetch(import.meta.env.VITE_API_URL + "films", User.getInstance().generateHeaders())
    .then(async (res) => {
      const json = await res.json()
      if (res.ok) return json
      else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({ name: "filmIndex" })
      }
    })
    .then(json => (data.value = json))
}

function supprimer(id) {
  const optionRequest = User.getInstance().generateHeaders()
  optionRequest.method = 'DELETE'
  console.log(id)
  fetch(import.meta.env.VITE_API_URL + "films/" + id, optionRequest)
    .then(async (res) => {
      const json = await res.json()
      if (res.ok) return getData()
      else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({ name: "filmIndex" })
      }
    })
    .catch(() => (getData()))
}

getData() // On charge les données au chargement de la page

</script>

<template>
  <h1>Les Films</h1>
  <RouterLink :to="{ name: 'filmCreate' }"><o-button variant="primary">➕ Ajouter un film</o-button></RouterLink>

  <o-table :data="data">
    <o-table-column field="_id" label="ID" numeric v-slot:default="props">
      <RouterLink :to="{ name: 'filmRead', params: { id: props.row._id } }"> {{ props.row._id }} </RouterLink>
    </o-table-column>

    <o-table-column field="title" label="Titre" numeric v-slot:default="props">
      {{ props.row.title }}
    </o-table-column>

    <o-table-column field="overview" label="Synopsis" numeric v-slot:default="props">
      {{ props.row.overview.substring(0, 100) + "..." }}
    </o-table-column>

    <o-table-column field="release_date" label="Date de sortie" numeric v-slot:default="props">
      {{ new Date(props.row.release_date).toLocaleDateString() }}
    </o-table-column>

    <o-table-column field="genres" label="Genres" numeric v-slot:default="props">
      <div class="tags are-medium">
        <span class="tag" v-for="genre in props.row.genres">{{ genre.title }}</span>
      </div>
    </o-table-column>


    <o-table-column field="created_at" label="Créé le :" numeric v-slot:default="props">
      {{ new Date(props.row.created_at).toLocaleString() }}
    </o-table-column>

    <o-table-column field="updated_at" label="Mise à jour le :" numeric v-slot:default="props">
      {{ new Date(props.row.updated_at).toLocaleString() }}
    </o-table-column>

    <o-table-column field="action" label="Action" numeric v-slot:default="props">
      <RouterLink :to="{ name: 'filmEdit', params: { id: props.row._id } }" class="button is-warning">
        Editer
      </RouterLink>

      <div class="button is-danger" @click="supprimer(props.row._id)">Supprimer</div>
    </o-table-column>

  </o-table>
</template>