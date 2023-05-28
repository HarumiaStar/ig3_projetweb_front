<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from "vue-router"
import { User, isAdministrator } from '../../utils/user'
import { errorNotif } from '../../utils/notification'
const router = useRouter()
const optionRequest = User.generateHeaders()

const props = defineProps({
    mode: {
        type: String,
        default: 'create'
    }
});

const route = useRoute()
let id = route.params.id;

const data = ref({
    name: "",
    adress: "",
    postal_code: "",
    city: "",
    country: "",
});

if (!isAdministrator() && props.mode !== 'read') {
    errorNotif("Vous n'avez pas les droits pour faire cette action.")
    router.replace({ name: "cinemaIndex" })
}

if (props.mode === 'read' || props.mode === 'edit') {
    if (id === "" || id === undefined) {
        router.push({ name: 'cinemaIndex' })
    }
    else {
        fetch(import.meta.env.VITE_API_URL + "cinemas/" + id, optionRequest).then((res) => {
            res.json().then((resp) => {
                delete resp.__v
                delete resp._id

                data.value = resp
            });
        });
    }
}

watch(() => route.params.id, (newValue) => {
    id = newValue
});

const isReadMode = computed(() => props.mode === 'read');

const updateForm = (e: any) => {
    if (!isAdministrator()) {
        errorNotif("Vous n'avez pas les droits pour modifier ce cinema.")
        router.replace({ name: "cinemaIndex" })
        return
    }
    e.preventDefault();

    let url = import.meta.env.VITE_API_URL + "cinemas";
    if (props.mode !== 'create') url += "/" + id

    fetch(url, {
        method: props.mode === 'create' ? "POST" : "PUT",
        ...optionRequest,
        body: JSON.stringify(data.value),
    }).then((res) => {
        res.json().then((resp) => {
            console.log(resp)
            router.push({ name: 'cinemaRead', params: { id: resp._id } })
        });
    });
};

function supprimer() {
    if (!isAdministrator()) {
        errorNotif("Vous n'avez pas les droits pour supprimer ce cinema.")
        router.replace({ name: "cinemaIndex" })
        return
    }
    const optionRequest = User.generateHeaders()
    optionRequest.method = 'DELETE'
    fetch(import.meta.env.VITE_API_URL + "cinemas/" + id, optionRequest)
        .then(async (res) => {
            const json = await res.json()
            if (res.ok) router.replace({ name: "cinemaIndex" })
            else {
                errorNotif("Impossible de supprimer le cinema")
                router.replace({ name: "cinemaIndex" })
            }
        })
        .catch(() => (router.replace({ name: "cinemaIndex" })))
}

</script>

<template>
    <div class="card">
        <form @submit="updateForm">
            <div class="card-content">
                <div class="media">
                    <div class="media-content">
                        <o-field label="Nom">
                            <o-input v-model="data.name" :readonly="isReadMode" />
                        </o-field>
                    </div>
                </div>

                <div class="content">
                    <o-field label="Adresse">
                        <o-input v-model="data.adress" :readonly="isReadMode" />
                    </o-field>
                    <o-field label="Code Postal" v-if="!isReadMode">
                        <o-input v-model="data.postal_code" :readonly="isReadMode" />
                    </o-field>
                    <o-field label="Ville">
                        <o-input v-model="data.city" :readonly="isReadMode" />
                    </o-field>
                    <o-field label="Pays">
                        <o-input v-model="data.country" :readonly="isReadMode" />
                    </o-field>
                </div>
            </div>
            <div v-if="isAdministrator()" class="card-footer">
                <RouterLink class="card-footer-item button is-warning" v-if="isReadMode"
                    :to="{ name: 'cinemaEdit', params: { id: id } }">
                    <div class="">Modifier</div>
                </RouterLink>
                <div class="card-footer-item button is-primary" @click="updateForm" v-if="!isReadMode">Envoyer</div>
                <div class="card-footer-item button is-danger" @click="supprimer">Supprimer</div>
            </div>
        </form>
    </div>
</template>
