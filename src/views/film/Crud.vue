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
    title: "",
    overview: "",
    poster_path: "",
    release_date: "",
    genres: [],
});

if (!isAdministrator() && props.mode !== 'read') {
    errorNotif("Vous n'avez pas les droits pour faire cette action.")
    router.replace({ name: "filmIndex" })
}

if (props.mode === 'read' || props.mode === 'edit') {
    if (id === "" || id === undefined) {
        router.push({ name: 'filmIndex' })
    }
    else {
        fetch(import.meta.env.VITE_API_URL + "films/" + id, optionRequest).then((res) => {
            res.json().then((resp) => {
                delete resp.__v
                delete resp._id

                data.value = {
                    ...resp,
                    release_date: resp.release_date.substring(0, 10)
                }
            });
        });
    }
}


const genres = ref([]);

const fetchGenres = () => {
    fetch(import.meta.env.VITE_API_URL + "genres", optionRequest).then((res) => {
        res.json().then((resp) => {
            genres.value = resp
        });
    });
};

if (props.mode !== 'read') {
    fetchGenres()
}

watch(
    () => props.mode,
    () => {
        if (props.mode !== 'read') {
            fetchGenres()
        }
    }
);

watch(() => route.params.id, (newValue) => {
    id = newValue
});

const isReadMode = computed(() => props.mode === 'read');

const updateForm = (e: any) => {
    if (!isAdministrator()) {
        errorNotif("Vous n'avez pas les droits pour modifier ce film.")
        router.replace({ name: "filmIndex" })
        return
    }
    e.preventDefault();

    let url = import.meta.env.VITE_API_URL + "films";
    if (props.mode !== 'create') url += "/" + id

    fetch(url, {
        method: props.mode === 'create' ? "POST" : "PUT",
        ...optionRequest,
        body: JSON.stringify(data.value),
    }).then((res) => {
        res.json().then((resp) => {
            console.log(resp)
            router.push({ name: 'filmRead', params: { id: resp._id } })
        });
    });
};

function supprimer() {
    if (!isAdministrator()) {
        errorNotif("Vous n'avez pas les droits pour supprimer ce film.")
        router.replace({ name: "filmIndex" })
        return
    }
    const optionRequest = User.generateHeaders()
    optionRequest.method = 'DELETE'
    fetch(import.meta.env.VITE_API_URL + "films/" + id, optionRequest)
        .then(async (res) => {
            const json = await res.json()
            if (res.ok) router.replace({ name: "filmIndex" })
            else {
                errorNotif("Impossible de supprimer le film")
                router.replace({ name: "filmIndex" })
            }
        })
        .catch(() => (router.replace({ name: "filmIndex" })))
}

</script>

<template>
    <div class="card">
        <form @submit="updateForm">
            <div class="card-content">
                <div class="media">
                    <div class="media-content">
                        <div style="text-align: center;">
                            <img :src="data.poster_path" alt="Poster du film"
                                style="max-height: 40vh; border-radius: 10px; ">
                        </div>
                        <o-field label="Titre">
                            <o-input v-model="data.title" :readonly="isReadMode" />
                        </o-field>
                    </div>
                </div>

                <div class="content">
                    <o-field label="Synopsis">
                        <o-input v-model="data.overview" type="textarea" :readonly="isReadMode" />
                    </o-field>
                    <o-field label="Image" v-if="!isReadMode">
                        <o-input v-model="data.poster_path" :readonly="isReadMode" />
                    </o-field>
                    <o-field label="Date de sortie">
                        <o-input v-model="data.release_date" type="date" :readonly="isReadMode" />
                    </o-field>


                    <o-field label="Genres">
                        <div class="tags are-medium" v-if="isReadMode">
                            <span class="tag" v-for="genre in data.genres">{{ genre.title }}</span>
                        </div>
                        <o-select v-else v-model="data.genres" multiple>
                            <option v-for="genre in genres" :value="genre">{{ genre.title }}</option>
                        </o-select>
                    </o-field>
                </div>
            </div>
            <div v-if="isAdministrator()" class="card-footer">
                <RouterLink class="card-footer-item button is-warning" v-if="isReadMode"
                    :to="{ name: 'filmEdit', params: { id: id } }">
                    <div class="">Modifier</div>
                </RouterLink>
                <div class="card-footer-item button is-primary" @click="updateForm" v-if="!isReadMode">Envoyer</div>
                <div class="card-footer-item button is-danger" @click="supprimer">Supprimer</div>
            </div>
        </form>
    </div>
</template>
