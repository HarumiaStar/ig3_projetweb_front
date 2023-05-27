export const User = {
    data : undefined,
    token : "",
    isAuthenticated : false,

    login(token: string) {
        this.token = token
        this.data = parseJwt(token)
        this.isAuthenticated = true
        localStorage.setItem("token", this.token)
        localStorage.setItem("user", JSON.stringify(this.data))
    },

    loadFromStorage() {
        const lStoken = localStorage.getItem("token")
        if (lStoken){
            this.login(lStoken)
        }
        else{
            console.log("Pas de token dans le localStorage")
        }
    },

    getData() : any {return this.data},
    
    getToken() : string {return this.token},
    
    generateHeaders(): any {
        return {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        }
    },
    
    logout(){
        this.data = undefined
        this.token = ""
        this.isAuthenticated = false
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    },
    
}

function parseJwt (token: string) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    return JSON.parse(jsonPayload);
}

export function isAdministrator() : boolean {
    return parseJwt(User.getToken()).is_admin
}

export function isAboutMe(id: string | string[]) : boolean {
    return User.getData()._id === id
}

export default User