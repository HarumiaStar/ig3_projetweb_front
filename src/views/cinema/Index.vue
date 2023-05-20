<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { errorNotif } from '../../utils/notification'
import { User } from '../../utils/user'

const data = ref([])
const router = useRouter()

function getData() {
  fetch(import.meta.env.VITE_API_URL + "cinemas", User.generateHeaders())
    .then(async (res) => {
      const json = await res.json()
      if (res.ok) return json
      else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({ name: "cinemaIndex" })
      }
    })
    .then(json => (data.value = json))
}

function supprimer(id) {
  const optionRequest = User.generateHeaders()
  optionRequest.method = 'DELETE'
  console.log(id)
  fetch(import.meta.env.VITE_API_URL + "cinemas/" + id, optionRequest)
    .then(async (res) => {
      const json = await res.json()
      if (res.ok) return getData()
      else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({ name: "cinemaIndex" })
      }
    })
    .catch(() => (getData()))
}

getData() // On charge les données au chargement de la page

</script>

<template>
  <h1>Les Cinémas</h1>
  <RouterLink :to="{ name: 'cinemaCreate' }"><o-button variant="primary">➕ Ajouter un cinema</o-button></RouterLink>

  <o-table :data="data">

    <o-table-column field="name" label="Nom" searchable sortable v-slot:default="props">
      {{ props.row.name }}
    </o-table-column>

    <o-table-column field="adress" label="Adresse" searchable sortable v-slot:default="props">
      {{ props.row.adress }}
    </o-table-column>

    <o-table-column field="postal_code" label="Code Postal" searchable sortable v-slot:default="props">
      {{ props.row.postal_code }}
    </o-table-column>

    <o-table-column field="city" label="Ville" searchable sortable v-slot:default="props">
      {{ props.row.city }}
    </o-table-column>

    <o-table-column field="country" label="Pays" searchable sortable v-slot:default="props">
      {{ props.row.country }}
    </o-table-column>


    <o-table-column field="created_at" label="Créé le :" v-slot:default="props">
      {{ new Date(props.row.created_at).toLocaleString() }}
    </o-table-column>

    <o-table-column field="updated_at" label="Mise à jour le :" v-slot:default="props">
      {{ new Date(props.row.updated_at).toLocaleString() }}
    </o-table-column>

    <o-table-column field="action" label="Action" numeric v-slot:default="props">
      <RouterLink :to="{name: 'cinemaRead', params:{id: props.row._id}}" class="button is-info">
        Voir
      </RouterLink>

      <RouterLink :to="{ name: 'cinemaEdit', params: { id: props.row._id } }" class="button is-warning">
        Editer
      </RouterLink>

      <div class="button is-danger" @click="supprimer(props.row._id)">Supprimer</div>
    </o-table-column>

  </o-table>
</template>