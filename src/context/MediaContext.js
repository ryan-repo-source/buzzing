import axios from "axios";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import secureLocalStorage from "react-secure-storage";

const MediaContext = createContext();


const MediaProvider = ({ children }) => {
    const [albums, setAlbums] = useState(null);
    const [albumsGroup, setGroupAlbums] = useState(null);
    
    const [hasMore, setHasMore] = useState(false);

    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));

    const createAlbums = async (user_id, title, description, group_id) => {
        try {
            const res = await axios.post(`https://buzzinguniverse.com/backend/api/post-album-request`, {
                user_id: user_id,
                title: title,
                description: description,
                group_id,
            });
            if (res.data.code == 200) {
                return {
                    message: "Album Added."
                }
            }
        } catch (error) {
            console.log(error)
        }
    };

    const updateAlbum = async (id, title, description) => {
        try {
            const res = await axios.post(`https://buzzinguniverse.com/backend/api/edit-album-request`, {
                id: id,
                title: title,
                description: description,
            });
            if (res.data.code == 200) {
                return {
                    message: "Album Updated."
                }
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getAlbums = async (user_id, page) => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-album-request?user_id=${user_id}`);
            const products = await res.data.data;
            if (res.data.code == 200) {
                setAlbums(products);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getMedia = async (user_id, album_id, limit) => {
        try {
            const res = await axios.get(
                `https://buzzinguniverse.com/backend/api/get-media-request?user_id=${user_id}` +
                (album_id ? `&album_id=${album_id}` : '') +
                (limit ? `&limit=${limit}` : '')
            );

            const products = await res.data.data;
            if (res.data.code == 200) {
                return products;
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Group
    const getGroupAlbums = async (group_id, page) => {
        try {
            const res = await axios.get(`https://buzzinguniverse.com/backend/api/get-album-request?group_id=${group_id}`);
            const products = await res.data.data;
            if (res.data.code == 200) {
                setGroupAlbums(products);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getGroupMedia = async (group_id, album_id, limit) => {
        try {
            const res = await axios.get(
                `https://buzzinguniverse.com/backend/api/get-media-request?group_id=${group_id}` +
                (album_id ? `&album_id=${album_id}` : '') +
                (limit ? `&limit=${limit}` : '')
            );

            const products = await res.data.data;
            if (res.data.code == 200) {
                return products;
            }
        } catch (error) {
            console.log(error)
        }
    }

    return <MediaContext.Provider value={{ albums, getGroupAlbums, getGroupMedia, albumsGroup, getAlbums, hasMore, createAlbums, getMedia, updateAlbum }} > {children} </MediaContext.Provider>
};

const useMediaContext = () => {
    return useContext(MediaContext);
}
export { MediaProvider, MediaContext, useMediaContext };
