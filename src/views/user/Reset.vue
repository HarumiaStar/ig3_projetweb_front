<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { infoNotif } from '../../utils/notification'

const router = useRouter()
const form = ref({
    email: ""
})



function forgottenPass(event: any) {
    // POST request to the API
    event.preventDefault()
  
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value)
    }
    
    fetch(import.meta.env.VITE_API_URL + "reset-password", requestOptions)
    .then(response => response.json())
    .then(data => {
        infoNotif(data.message);
    });
}

</script>

<template>
    <h1>Mot de passe oublié</h1>
    <div class="card">
        <form @submit="forgottenPass">
            <div class="card-content">
                <div class="media">
                    <div class="media-content">
                        <o-field label="Email">
                            <o-input required type="email" placeholder="Reseigner votre email ici" maxlength="30"
                                icon="envelope" v-model="form.email">
                            </o-input>
                        </o-field>
                    </div>
                </div>
            </div>
            <div class="card-footer-item button is-primary" @click="forgottenPass">Envoyer</div>
        </form>
    </div>
</template>