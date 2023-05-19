import { useProgrammatic } from '@oruga-ui/oruga-next'
const { oruga } = useProgrammatic()

export function errorNotif(message : string){
    console.error("Impossible de récuperer les données")
    return oruga.notification.open({
        duration: 5000,
        message: `<b>${message}</b>`,
        position: 'bottom-right',
        variant: 'danger'
    })
}