<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { errorNotif } from '../../utils/notification'
import { User } from '../../utils/user'

const data = ref([])
const router = useRouter()

function getData() {
  fetch(import.meta.env.VITE_API_URL + "sessions", User.generateHeaders())
    .then(async (res) => {
      const json = await res.json()
      if (res.ok) return json
      else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({ name: "sessionIndex" })
      }
    })
    .then(json => (data.value = json))
}

function supprimer(id) {
  const optionRequest = User.generateHeaders()
  optionRequest.method = 'DELETE'
  console.log(id)
  fetch(import.meta.env.VITE_API_URL + "sessions/" + id, optionRequest)
    .then(async (res) => {
      const json = await res.json()
      if (res.ok) return getData()
      else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({ name: "sessionIndex" })
      }
    })
    .catch(() => (getData()))
}

getData() // On charge les données au chargement de la page

</script>

<template>
  <h1>Les Scéances</h1>
  <RouterLink :to="{ name: 'sessionCreate' }"><o-button variant="primary">➕ Ajouter une scéance</o-button></RouterLink>

  <o-table :data="data">

    <o-table-column field="date" label="Horodatage" sortable v-slot:default="props">
      {{ new Date(props.row.date).toLocaleString() }}
    </o-table-column>

    <o-table-column field="film.title" label="Film" searchable sortable v-slot:default="props">
      {{ props.row.film.title }}
    </o-table-column>

    <o-table-column field="cinema.name" label="Cinéma" searchable sortable v-slot:default="props">
      {{ props.row.cinema.name }}
    </o-table-column>

    <o-table-column field="created_at" label="Créé le :" sortable v-slot:default="props">
      {{ new Date(props.row.created_at).toLocaleString() }}
    </o-table-column>

    <o-table-column field="updated_at" label="Mise à jour le :" sortable v-slot:default="props">
      {{ new Date(props.row.updated_at).toLocaleString() }}
    </o-table-column>

    <o-table-column field="action" label="Action" numeric v-slot:default="props">
      <RouterLink :to="{name: 'sessionRead', params:{id: props.row._id}}" class="button is-info">
        Voir
      </RouterLink>

      <RouterLink :to="{ name: 'sessionEdit', params: { id: props.row._id } }" class="button is-warning">
        Editer
      </RouterLink>

      <div class="button is-danger" @click="supprimer(props.row._id)">Supprimer</div>
    </o-table-column>

  </o-table>
</template>