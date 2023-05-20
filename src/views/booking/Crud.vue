<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from "vue-router"
import { User } from '../../utils/user'
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
    user: {},
    session: {
        film: {
            title: ""
        }
    }
});

if (props.mode === 'read' || props.mode === 'edit') {
    if (id === "" || id === undefined) {
        router.push({ name: 'bookingIndex' })
    }
    else {
        fetch(import.meta.env.VITE_API_URL + "bookings/" + id, optionRequest).then((res) => {
            res.json().then((resp) => {
                delete resp.__v
                delete resp._id
                delete resp.session.film.genres

                data.value = resp
            });
        });
    }
}


const sessions = ref([]);
const users = ref([]);

const fetchSessions = () => {
    fetch(import.meta.env.VITE_API_URL + "sessions", optionRequest).then((res) => {
        res.json().then((resp) => {
            sessions.value = resp
            sessions.value.forEach((session: any) => {
                delete session.film.genres
            });
        });
    });
};

const fetchUsers = () => {
    fetch(import.meta.env.VITE_API_URL + "users", optionRequest).then((res) => {
        res.json().then((resp) => {
            users.value = resp
        });
    });
};

if (props.mode !== 'read') {
    fetchSessions()
    fetchUsers()
}

watch(
    () => props.mode,
    () => {
        if (props.mode !== 'read') {
            fetchSessions()
            fetchUsers()
        }
    }
);

watch(() => route.params.id, (newValue) => {
    id = newValue
});

const isReadMode = computed(() => props.mode === 'read');

const updateForm = (e: any) => {
    e.preventDefault();

    let url = import.meta.env.VITE_API_URL + "bookings";
    if (props.mode !== 'create') url += "/" + id

    fetch(url, {
        method: props.mode === 'create' ? "POST" : "PUT",
        ...optionRequest,
        body: JSON.stringify(data.value),
    }).then((res) => {
        res.json().then((resp) => {
            console.log(resp)
            router.push({ name: 'bookingRead', params: { id: resp._id } })
        });
    });
};

function supprimer() {
    const optionRequest = User.generateHeaders()
    optionRequest.method = 'DELETE'
    fetch(import.meta.env.VITE_API_URL + "bookings/" + id, optionRequest)
        .then(async (res) => {
            const json = await res.json()
            if (res.ok) router.replace({ name: "bookingIndex" })
            else {
                errorNotif("Impossible de supprimer la réservation")
                router.replace({ name: "bookingIndex" })
            }
        })
        .catch(() => (router.replace({ name: "bookingIndex" })))
}

</script>

<template>
    <div class="card">
        <form @submit="updateForm">
            <div class="card-content">
                <div class="content">
                    <o-field label="Utilisateur">
                        <div class="tags are-medium" v-if="isReadMode">
                            <span class="tag">{{ data.user.name +" "+ data.user.first_name }}</span>
                        </div>
                        <o-select v-else v-model="data.user">
                            <option v-for="user in users" :value="user">{{ user.name +" "+ user.first_name }}</option>
                        </o-select>
                    </o-field>


                    <o-field label="Scéance">
                        <div class="tags are-medium" v-if="isReadMode">
                            <span class="tag">{{ new Date(data.session.date).toLocaleString() +" , "+ data.session.film.title }}</span>
                        </div>
                        <o-select v-else v-model="data.session">
                            <option v-for="session in sessions" :value="session">{{ new Date(session.date).toLocaleString() +" , "+ session.film.title }}</option>
                        </o-select>
                    </o-field>
                </div>
            </div>
            <div class="card-footer">
                <RouterLink class="card-footer-item button is-warning" v-if="isReadMode"
                    :to="{ name: 'bookingEdit', params: { id: id } }">
                    <div class="">Modifier</div>
                </RouterLink>
                <div class="card-footer-item button is-primary" @click="updateForm" v-if="!isReadMode">Envoyer</div>
                <div class="card-footer-item button is-danger" @click="supprimer">Supprimer</div>
            </div>
        </form>
    </div>
</template>
