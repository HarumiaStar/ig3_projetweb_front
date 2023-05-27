<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from "vue-router"
import { User, isAboutMe } from '../../utils/user'
import { errorNotif } from '../../utils/notification'

const route = useRoute()
const router = useRouter()
const id = route.params.id

if (id === "" || id === undefined) {
    router.replace({name: "userIndex"})
}

if (!isAboutMe(id)){
  errorNotif("Vous n'avez pas les droits pour accéder à cette page")
  router.replace({name: "userIndex"})
}

const form = ref({
    name: undefined,
    first_name: undefined,
    email: undefined,
    birthday: undefined,
    city: undefined,
    password: undefined,
    newPassword: undefined
})

fetch(import.meta.env.VITE_API_URL + "users/" + id, User.generateHeaders())
.then(async response => {
    const res = await response.json();
    if (response.ok) return res
    else {
        errorNotif("Token d'acces non valide ou innexistant")
        router.replace({name: "userLogin"})
    }
})
.then(json => {
    form.value = {
        ...json,
        birthday: json.birthday.substring(0,10)
    }
})


function updateForm(event: any){
    event.preventDefault()

    const requestOptions = {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + User.getToken(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(form.value)
    }

    fetch(import.meta.env.VITE_API_URL + "users/" + id, requestOptions)
    .then(async response => {
        const json = await response.json()
        console.log(json)
        if (response.ok) {
            if (json._id === User.getData()._id){
                User.logout()
                router.replace({name: "userLogin"})
            }
            else router.replace({name: "userRead"})
        }
        else errorNotif("Token d'acces non valide ou innexistant")
    })
}

</script>

<template>
    <h1>Modification du compte</h1>
    <form @submit="updateForm">
        <o-field label="Prénom">
          <o-input required v-model="form.name" icon="user"></o-input>
        </o-field>

        <o-field label="Nom">
          <o-input required v-model="form.first_name" placeholder="Ateur"></o-input>
        </o-field>

        <o-field label="Email">
          <o-input required type="email" placeholder="nordine.ateur@umontpellier.fr" maxlength="30" v-model="form.email"
            icon="envelope"></o-input>
        </o-field>

        <o-field label="Date de Naissance">
          <o-input required type="date" v-model="form.birthday"></o-input>
        </o-field>

        <o-field label="Ville">
          <o-input required v-model="form.city" placeholder="Montpellier"></o-input>
        </o-field>

        <o-field label="Ancien Mot de Passe">
          <o-input  v-model="form.password" type="password" placeholder="***************" password-reveal></o-input>
        </o-field>
        
        <o-field>
            <template #label> Nouveau Mot de Passe
                <o-tooltip class="is-warning" position="right" label="Le mot de passe doit contenir au moins huit caractères, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.">
                  <o-icon size="small" icon="question-circle"></o-icon>
                </o-tooltip>
            </template>
          <o-input  v-model="form.newPassword" type="password" placeholder="***************" password-reveal></o-input>
        </o-field>

        <o-button nativeType="submit" variant="success">Enregistrer</o-button>
    </form>
</template>