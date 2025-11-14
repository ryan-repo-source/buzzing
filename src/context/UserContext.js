import axios from "axios";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
// import reducer from "../reducer/UserReducer";
import secureLocalStorage from "react-secure-storage";

const UserContext = createContext();


const AppProvider = ({ children }) => {
    // const [state, dispatch] = useReducer(reducer, initailState);
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'))
    const [auth_data, setAuth] = useState(null);

    const getAuth = async () => {
        if (!auth) return;

        try {
            const response = await axios.get(
                `https://buzzinguniverse.com/backend/api/get-user-data/${auth?.id}`
            );
            setAuth(response.data.data?.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const [tabb, setTabb] = useState('activity');
    const [groupTab, setGroupTab] = useState('home');

    const [myFreinds, setMyFreinds] = useState(null);

    const [freinds, setFreinds] = useState(null);
    const [request, setRequests] = useState(null);
    const GetFreindsRequests = async (userId, type) => {
        try {
            const response = await axios.post("https://buzzinguniverse.com/backend/api/friend-list",
                { userid: userId, type: type },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200) {
                if (type === 1) {
                    setRequests(response.data.data || []);
                } else if (type === 2) {
                    setFreinds(response.data.data || []);
                }
            } else {

            }
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {

        }
    };

    const GetMyFreinds = async (type) => {
        try {
            const response = await axios.post("https://buzzinguniverse.com/backend/api/friend-list",
                { userid: auth?.id, type: type },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200) {
                setMyFreinds(response.data.data || [])
            } else {

            }
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {

        }
    };

    const Notify = async (user_id, notification_text, notification_link) => {
        if (user_id == auth.id) return false;
        try {
            const response = await axios.post("https://buzzinguniverse.com/backend/api/create-notification-request",
                { user_id, notification_text, notification_link },
            );
        } catch (error) {
            console.error("Error updating user:", error);
        } finally {

        }
    };

    useEffect(() => {
        let interval;
        if (auth?.email) {
            const callActivityActive = async () => {
                try {
                    await axios.post("https://buzzinguniverse.com/backend/api/activity-active", {
                        email: auth.email,
                    });
                } catch (error) {
                    console.error("Error calling activity-active:", error);
                }
            };

            callActivityActive();
            interval = setInterval(callActivityActive, 60000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [auth?.email]);

    useEffect(() => {
        if (auth) {
            GetMyFreinds(2);
            getAuth();
        } else {
            setAuth({});
        }
    }, [])

    return <UserContext.Provider value={{ groupTab, setGroupTab, setTabb, tabb, GetFreindsRequests, freinds, request, myFreinds, auth_data, getAuth, Notify }} > {children} </UserContext.Provider>
};

const useUserContext = () => {
    return useContext(UserContext);
}
export { AppProvider, UserContext, useUserContext };
