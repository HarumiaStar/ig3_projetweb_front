<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from "vue-router"
import { User } from '../../utils/user'
import { errorNotif } from '../../utils/notification'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const data = ref();

fetch(import.meta.env.VITE_API_URL + "users/" + id, User.generateHeaders())
.then(async (res) => {
  const json = await res.json()
  if (res.ok) return json
    else {
      errorNotif("Token d'acces non valide ou innexistant")
      router.replace({name: "userLogin"})
    }
})
.then(json => (data.value = json))

function supprimer(){
  const optionRequest = User.generateHeaders()
  optionRequest.method = 'DELETE'
  fetch(import.meta.env.VITE_API_URL + "users/" + id, optionRequest)
  .then(async (res) => {
      const json = await res.json()
      console.log(json)
      if (res.ok) router.replace({name: "userIndex"})
      else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({name: "userLogin"})
      }
  })
  .catch(()=> (router.replace({name: "userIndex"})))
}

</script>

<template>
    <span v-if="data">
        <h1>Information du compte {{ data._id }}</h1>
        <div class="card">
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="/src/assets/img/user.png" alt="Image du compte">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">{{ data.name }} {{data.first_name}}</p>
                <p class="subtitle is-6">{{ data.email }}</p>
              </div>
            </div>
        
            <div class="content">
              <p>Je suis né.e le {{ new Date(data.birthday).toLocaleDateString() }}.
              Je vie à {{ data.city }}</p>
              <time datetime="2016-1-1">Compte créé le : {{ new Date(data.created_at).toLocaleString() }} ; Compte mis à jour le : {{ new Date(data.updated_at).toLocaleString() }}</time>
            </div>
          </div>
          <div class="card-footer">
            <RouterLink class="card-footer-item button is-warning" :to="{name: 'userEdit', params:{id: data._id}}">Modifier</RouterLink>
            <div class="card-footer-item button is-danger" @click="supprimer">Supprimer</div>
          </div>
        </div>
    </span>
    <span v-else>
        Chargement ...
    </span>
</template>