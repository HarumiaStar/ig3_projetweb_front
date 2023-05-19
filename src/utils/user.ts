export class User {
    readonly data: any
    readonly token: string

    private static _instance: User

    private constructor(token: string) {
        this.token = token
        this.data = parseJwt(token)
        localStorage.setItem("token", this.token)
        localStorage.setItem("user", JSON.stringify(this.data))
    }

    public static getInstance(token = "") : User{
        return this._instance || (this._instance = new this(token))
    }

    public static loadFromStorage() {
        const lStoken = localStorage.getItem("token")
        if (lStoken){
            this._instance = new this(lStoken)
        }
        else{
            console.log("Pas de token dans le localStorage")
        }
    }

    public getData() : any {return this.data}
    
    public getToken() : string {return this.token}
    
    public generateHeaders(): any {
        return {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.token
            }
        }
    }
    
    public static isAuthenticated() : boolean  {
        return this._instance !== undefined && User._instance.getToken() !== undefined && this._instance.data && this._instance.data.exp > Date.now()/1000
    }
    
    public static clearStorage(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }
    
}

function parseJwt (token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
