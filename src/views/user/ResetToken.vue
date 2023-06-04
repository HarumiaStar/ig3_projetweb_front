<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from "vue-router"
import { User } from '../../utils/user'
import { errorNotif, infoNotif } from '../../utils/notification'
const router = useRouter()
const route = useRoute()

const form = ref({
    email: "",
    password: ""
})

const token = route.params.token

function changePassword(event: any){
    event.preventDefault()
  
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value)
    }

    fetch(import.meta.env.VITE_API_URL + "reset-password/" + token, requestOptions)
    .then(async (res) => {
        const json = await res.json()
        if (res.ok) {
            infoNotif("Votre mot de passe a bien été modifié.")
            router.replace({name: "userLogin"})
        }
        else {
            errorNotif(json.message)
            router.replace({name: "userLogin"})
        }
    })
}

</script>

<template>
    <h1>Modification de votre mot de passe</h1>
    <div class="card">
        <form @submit="changePassword">
            <div class="card-content">
                <div class="media">
                    <div class="media-content">
                        <o-field label="Email">
                            <o-input required type="email" placeholder="Reseigner votre email ici" maxlength="30"
                                icon="envelope" v-model="form.email">
                            </o-input>
                        </o-field>

                        <o-field>
                            <template #label> Mot de Passe
                                <o-tooltip class="is-warning" position="right" label="Le mot de passe doit contenir au moins huit caractères, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.">
                                <o-icon size="small" icon="question-circle"></o-icon>
                                </o-tooltip>
                            </template>
                            <o-input required v-model="form.password" type="password" placeholder="***************" password-reveal></o-input>
                        </o-field>
                    </div>
                </div>
            </div>
            <div class="card-footer-item button is-primary" @click="changePassword">Envoyer</div>
        </form>
    </div>
</template>