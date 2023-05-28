<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { errorNotif } from '../../utils/notification'
import { User, isAdministrator } from '../../utils/user'

const data = ref([])
const router = useRouter()

function getData() {
  fetch(import.meta.env.VITE_API_URL + "films", User.generateHeaders())
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
  if (!isAdministrator()) {
    errorNotif("Vous n'avez pas les droits pour supprimer ce film.")
    router.replace({ name: "filmIndex" })
    return
  }
  const optionRequest = User.generateHeaders()
  optionRequest.method = 'DELETE'
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
  <RouterLink v-if="isAdministrator()" :to="{ name: 'filmCreate' }"><o-button variant="primary">➕ Ajouter un film</o-button></RouterLink>

  <o-table :data="data">

    <o-table-column field="title" label="Titre" searchable sortable v-slot:default="props">
      {{ props.row.title }}
    </o-table-column>

    <o-table-column field="overview" label="Synopsis" searchable sortable v-slot:default="props">
      {{ props.row.overview.substring(0, 100) + "..." }}
    </o-table-column>

    <o-table-column field="genres" label="Genres" sortable v-slot:default="props">
      <div class="tags are-medium">
        <span class="tag" v-for="genre in props.row.genres"><RouterLink :to="{name: 'genreRead', params:{id: genre._id}}">{{ genre.title }} </RouterLink></span>
      </div>
    </o-table-column>

    <o-table-column field="release_date" label="Date de sortie" sortable v-slot:default="props">
      {{ new Date(props.row.release_date).toLocaleDateString() }}
    </o-table-column>

    <o-table-column field="created_at" label="Créé le :" sortable v-slot:default="props">
      {{ new Date(props.row.created_at).toLocaleString() }}
    </o-table-column>

    <o-table-column field="updated_at" label="Mise à jour le :" sortable v-slot:default="props">
      {{ new Date(props.row.updated_at).toLocaleString() }}
    </o-table-column>

    <o-table-column field="action" label="Action" v-slot:default="props">
      <RouterLink :to="{name: 'filmRead', params:{id: props.row._id}}" class="button is-info">
        Voir
      </RouterLink>

      <RouterLink v-if="isAdministrator()" :to="{ name: 'filmEdit', params: { id: props.row._id } }" class="button is-warning">
        Editer
      </RouterLink>

      <div v-if="isAdministrator()" class="button is-danger" @click="supprimer(props.row._id)">Supprimer</div>
    </o-table-column>

  </o-table>
</template>