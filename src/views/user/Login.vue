<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from "vue-router"
import { User } from '../../utils/user'
const router = useRouter()

const form = ref({
    email: "",
    password: ""
})

function login(event: any){
    event.preventDefault()
  
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value)
    }

    fetch(import.meta.env.VITE_API_URL + "users/login", requestOptions)
    .then(response => response.json())
    .then(data => {
        User.login(data.token)
        location.replace("/users/"+User.getData()._id)
        router.replace({ name: "userRead", params: { id: User.getData()._id}})
    });
}
</script>

<template>
    <h1>Connexion</h1>

    <form @submit="login">
        <o-field label="Email">
          <o-input required type="email" placeholder="Reseigner votre email ici" maxlength="30" v-model="form.email"
            icon="envelope"></o-input>
        </o-field>

        <o-field>
            <template #label> Mot de Passe
                <o-tooltip class="is-warning" position="right" label="Le mot de passe doit contenir au moins huit caractères, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.">
                  <o-icon size="small" icon="question-circle"></o-icon>
                </o-tooltip>
            </template>
          <o-input required v-model="form.password" type="password" placeholder="***************" password-reveal></o-input>
        </o-field>

        
        <span v-if="form.email && form.password">
            <o-button nativeType="submit" variant="success">Se connecter</o-button>
        </span>
        <span v-else>
            <o-button class="is-danger" nativeType="submit" variant="success">Se connecter</o-button>
        </span>
    </form>

    <RouterLink :to="{ name: 'userReset' }" class="button is-warning">Mot de passe oublié ?</RouterLink>

</template>