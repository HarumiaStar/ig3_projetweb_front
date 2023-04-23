<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from "vue-router"

const route = useRoute()
const router = useRouter()
const id = route.params.id

const data = ref();

fetch(import.meta.env.VITE_API_URL + "users/" + id)
.then(response => {
    if (response.ok) return response.json();
    else router.replace({name: "userIndex"})
})
.then(json => (data.value = json))

function supprimer(){
    fetch(import.meta.env.VITE_API_URL + "users/" + id, { method: 'DELETE' })
    .then(()=> (router.replace({name: "userIndex"})))
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
            <div class="card-footer-item button is-warning"><RouterLink :to="{name: 'userEdit', params:{id: data._id}}">Modifier</RouterLink></div>
            <div class="card-footer-item button is-danger" @click="supprimer">Supprimer</div>
          </div>
        </div>
    </span>
    <span v-else>
        Chargement ...
    </span>
</template>