<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { errorNotif } from '../../utils/notification'
import { User, isAboutMe, isAdministrator } from '../../utils/user'

const data = ref([])
const router = useRouter()

function getData() {
  fetch(import.meta.env.VITE_API_URL + "bookings", User.generateHeaders())
    .then(async (res) => {
      const json = await res.json()
      if (res.ok) return json
      else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({ name: "bookingIndex" })
      }
    })
    .then(json => (data.value = json))
}

function supprimer(id, user_id) {
  if (!isAdministrator() && !isAboutMe(user_id)) {
    errorNotif("Vous n'avez pas les droits pour supprimer cette réservation.")
    router.replace({ name: "bookingIndex" })
    return
  }
  const optionRequest = User.generateHeaders()
  optionRequest.method = 'DELETE'
  fetch(import.meta.env.VITE_API_URL + "bookings/" + id, optionRequest)
    .then(async (res) => {
      const json = await res.json()
      if (res.ok) return getData()
      else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({ name: "bookingIndex" })
      }
    })
    .catch(() => (getData()))
}

getData() // On charge les données au chargement de la page

</script>

<template>
  <h1>Les Réservations</h1>
  <RouterLink :to="{ name: 'bookingCreate' }" ><o-button variant="primary">➕ Ajouter une réservation</o-button></RouterLink>

  <o-table :data="data">
    <o-table-column sortable field="session.date" label="Horodatage" v-slot:default="props">
      {{ new Date(props.row.session.date).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}}
    </o-table-column>

    <o-table-column searchable sortable field="user.name user.first_name" label="Utilisateur" v-slot:default="props">
      <RouterLink :to="{name: 'userRead', params:{id: props.row.user._id}}"> {{ props.row.user.name + " " + props.row.user.first_name }} </RouterLink>
    </o-table-column>

    <o-table-column searchable sortable field="session.film.title" label="Film" v-slot:default="props">
      <RouterLink :to="{name: 'filmRead', params:{id: props.row.session.film._id}}"> {{ props.row.session.film.title }} </RouterLink>
    </o-table-column>

    <o-table-column searchable sortable field="session.cinema.name" label="Cinéma" v-slot:default="props">
      <RouterLink :to="{name: 'cinemaRead', params:{id: props.row.session.cinema._id}}"> {{ props.row.session.cinema.name }} </RouterLink>
    </o-table-column>

    <o-table-column sortable field="created_at" label="Créé le :" v-slot:default="props">
      {{ new Date(props.row.created_at).toLocaleString() }}
    </o-table-column>

    <o-table-column  sortable field="updated_at" label="Mise à jour le :" v-slot:default="props">
      {{ new Date(props.row.updated_at).toLocaleString() }}
    </o-table-column>

    <o-table-column field="action" label="Action" v-slot:default="props">
      <RouterLink :to="{name: 'bookingRead', params:{id: props.row._id}}" class="button is-info">
        Voir
      </RouterLink>

      <RouterLink  v-if="isAdministrator() || isAboutMe(props.row.user._id)" :to="{ name: 'bookingEdit', params: { id: props.row._id } }" class="button is-warning">
        Editer
      </RouterLink>

      <div  v-if="isAdministrator() || isAboutMe(props.row.user._id)" class="button is-danger" @click="supprimer(props.row._id, props.row.user._id)">Supprimer</div>
    </o-table-column>

  </o-table>
</template>