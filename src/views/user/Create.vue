<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router"
const router = useRouter()

const form = ref({
    name: undefined,
    first_name: undefined,
    email: undefined,
    birthday: undefined,
    city: undefined,
    password: undefined
})

function sendForm(event: any){
    event.preventDefault()
  
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value)
    }
    
    fetch(import.meta.env.VITE_API_URL + "users", requestOptions)
    .then(response => response.json())
    .then(data => {
      router.push({ name: "userRead", params: { id: data._id}});
    });
}

</script>

<template>
    <h1>Inscription</h1>
    
    <form @submit="sendForm">
        <o-field label="Prénom">
          <o-input required v-model="form.name" placeholder="Nordine" icon="user"></o-input>
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
        
        <o-field>
            <template #label> Mot de Passe
                <o-tooltip class="is-warning" position="right" label="Le mot de passe doit contenir au moins huit caractères, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.">
                  <o-icon size="small" icon="question-circle"></o-icon>
                </o-tooltip>
            </template>
          <o-input required v-model="form.password" type="password" placeholder="***************" password-reveal></o-input>
        </o-field>
        
        <o-button nativeType="submit" variant="success">Envoyer</o-button>
    </form>
</template>