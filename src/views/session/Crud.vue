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
    date: "",
    film: "",
    cinema: "",
});

if (!isAdministrator() && props.mode !== 'read') {
    errorNotif("Vous n'avez pas les droits pour faire cette action.")
    router.replace({ name: "sessionIndex" })
}

if (props.mode === 'read' || props.mode === 'edit') {
    if (id === "" || id === undefined) {
        router.push({ name: 'sessionIndex' })
    }
    else {
        fetch(import.meta.env.VITE_API_URL + "sessions/" + id, optionRequest).then((res) => {
            res.json().then((resp) => {
                delete resp.__v
                delete resp._id
                delete resp.film.genres

                data.value = {
                    ...resp,
                    date: resp.date.substring(0, 16)
                }
            });
        });
    }
}


const films = ref([]);
const cinemas = ref([]);

const fetchFilms = () => {
    fetch(import.meta.env.VITE_API_URL + "films", optionRequest).then((res) => {
        res.json().then((resp) => {
            films.value = resp
            films.value.forEach((film: any) => {
                delete film.genres
            });
        });
    });
};
const fetchCinemas = () => {
    fetch(import.meta.env.VITE_API_URL + "cinemas", optionRequest).then((res) => {
        res.json().then((resp) => {
            cinemas.value = resp
        });
    });
};

if (props.mode !== 'read') {
    fetchFilms()
    fetchCinemas()
}

watch(
    () => props.mode,
    () => {
        if (props.mode !== 'read') {
            fetchFilms()
            fetchCinemas()
        }
    }
);


watch(() => route.params.id, (newValue) => {
    id = newValue
});

const isReadMode = computed(() => props.mode === 'read');

const updateForm = (e: any) => {
    if (!isAdministrator()) {
        errorNotif("Vous n'avez pas les droits pour modifier cette séance.")
        router.replace({ name: "sessionIndex" })
        return
    }
    e.preventDefault();

    let url = import.meta.env.VITE_API_URL + "sessions";
    if (props.mode !== 'create') url += "/" + id

    fetch(url, {
        method: props.mode === 'create' ? "POST" : "PUT",
        ...optionRequest,
        body: JSON.stringify(data.value),
    }).then((res) => {
        res.json().then((resp) => {
            console.log(resp)
            router.push({ name: 'sessionRead', params: { id: resp._id } })
        });
    });
};

function supprimer() {
    if (!isAdministrator()) {
        errorNotif("Vous n'avez pas les droits pour supprimer cette séance.")
        router.replace({ name: "sessionIndex" })
        return
    }
    const optionRequest = User.generateHeaders()
    optionRequest.method = 'DELETE'
    fetch(import.meta.env.VITE_API_URL + "sessions/" + id, optionRequest)
        .then(async (res) => {
            const json = await res.json()
            if (res.ok) router.replace({ name: "sessionIndex" })
            else {
                errorNotif("Impossible de supprimer la séance.")
                router.replace({ name: "sessionIndex" })
            }
        })
        .catch(() => (router.replace({ name: "sessionIndex" })))
}

</script>

<template>
    <div class="card">
        <form @submit="updateForm">
            <div class="card-content">
                <div class="media">
                    <div class="media-content">
                        <o-field label="Horodatage">
                            <o-input v-model="data.date" type="datetime-local" :readonly="isReadMode" />
                        </o-field>
                    </div>
                </div>

                <div class="content">
                    <o-field label="Film">
                        <div class="tags are-medium" v-if="isReadMode">
                            <o-input v-model="data.film.title" :readonly="isReadMode" />
                        </div>
                        <o-select v-else v-model="data.film">
                            <option v-for="film in films" :value="film">{{ film.title }}</option>
                        </o-select>
                    </o-field>

                    <o-field label="Cinéma">
                        <div class="tags are-medium" v-if="isReadMode">
                            <o-input v-model="data.cinema.name" :readonly="isReadMode" />
                        </div>
                        <o-select v-else v-model="data.cinema">
                            <option v-for="cinema in cinemas" :value="cinema">{{ cinema.name }}</option>
                        </o-select>
                    </o-field>
                </div>
            </div>
            <div v-if="isAdministrator()" class="card-footer">
                <RouterLink class="card-footer-item button is-warning" v-if="isReadMode"
                    :to="{ name: 'sessionEdit', params: { id: id } }">
                    <div class="">Modifier</div>
                </RouterLink>
                <div class="card-footer-item button is-primary" @click="updateForm" v-if="!isReadMode">Envoyer</div>
                <div class="card-footer-item button is-danger" @click="supprimer">Supprimer</div>
            </div>
        </form>
    </div>
</template>
