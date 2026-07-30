import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { login, register, is_authenticated } from "./api";

const AuthChech = createContext()

export const Authenticate = ({ children }) => {
    const [Auth, setAuth] = useState(false)
    const [user, setUser] = useState(null);
    const [loading, setloading] = useState(true)
    const nav = useNavigate()
    const [name, setname] = useState(localStorage.getItem("username"))
    const [userinfo, setuserinfi] = useState(null)          // was {}
    const [infoLoading, setInfoLoading] = useState(true)

    const loadUserInfo = async () => {
        setInfoLoading(true)
        try {
            const res = await api.get('user-info/')
            setuserinfi(res.data)
        } catch (err) {
            console.log(err.message)
            setuserinfi(null)
        } finally {
            setInfoLoading(false)
        }
    }

    const loadUser = async () => {
        try {
            const res = await api.post("authenticated/");

            setAuth(res.data.authenticated);
            setUser(res.data.user);

            if (res.data.authenticated) {
                await loadUserInfo();
            } else {
                setuserinfi(null);
            }
        } catch {
            setAuth(false);
            setUser(null);
            setuserinfi(null);
        } finally {
            setloading(false);
        }
    };

    const register_auth = async (agency_name, username, email, password, Cpassword, role) => {
        if (password == Cpassword) {
            try {
                await register(agency_name, username, email, password, role)
            } catch (err) {
                throw err
            }
        }
    }


    const login_auth = async (email, password, remember_me) => {
        const result = await login(email, password, remember_me)
        if (result.success) {
            await loadUser();
            await loadUserInfo();
        }
        return result   // { success, message }
    }

    useEffect(() => {
        loadUser();
    }, [])

    return (
        <AuthChech.Provider value={{
            register_auth, userinfo, login_auth, infoLoading, Auth, setAuth, name, user, setUser, setname, loading, loadUser,       // <-- add this
            loadUserInfo,
        }}>
            {children}
        </AuthChech.Provider>
    )
}

export const useAuth = () => useContext(AuthChech) 