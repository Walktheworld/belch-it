import React, {useState, useContext,  useCallback} from "react"

import {MessageContext} from "../context/message"

const UserContext = React.createContext()

function UserProvider({children}) {
    const [user, setUser] = useState(null);
    const {setMessage} = useContext(MessageContext)

    const getCurrentUser = useCallback(async () => { 
        try {
            const resp = await fetch("/api/me")
             if (resp.status === 200) {
                const data = await resp.json()
                setUser({...data.data.attributes, breweries: data.data.relationships.breweries.data})
             } else {
                const errorObj = await resp.json()
                setMessage({message: errorObj.error, color: "red"})
             }
        } catch (e) {
            setMessage({message: e.message, color: "red"})
        }
    }, [setMessage])

    const login = async (userInfo) => {
        try {
            const resp = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(userInfo)
            })
            if (resp.status === 202) {
                const data = await resp.json()
                setUser({...data.data.attributes, breweries: data.data.relationships.breweries.data})
                return true
            } else {
                const errorObj = await resp.json()
                setMessage({message: errorObj.error, color: "red"})
                return false
            }

        } catch(e) {
            setMessage({message: e.message, color: "red"})
        }
    }
    const signup = async (userInfo) => {
        try {
            const resp = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(userInfo)
            })
            if (resp.status === 201) {
                const data = await resp.json()
                setUser({...data.data.attributes, breweries: data.data.relationships.breweries.data})
            } else {
                const errorObj = await resp.json()
                setMessage({message: errorObj.error, color: "red"})
            }

        } catch(e) {
            setMessage({message: e.message, color: "red"})
        }
    }
    const signout = async () => { 
        try {
            const resp = await fetch("/api/logout", {
                method: "DELETE"
            })
            setMessage({messge: "You have been logged out", color: "green"})
            setUser(null)
            return true
        } catch(e) {
            setMessage({message: e.message, color: "red"})
            return false
        }
    }

    return (
        <UserContext.Provider value={{user, setUser,  getCurrentUser, login, signup, signout}}>
            {children}
        </UserContext.Provider>
    )

}

export {UserContext, UserProvider}