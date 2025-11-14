import React, { useEffect, useState } from 'react'
import { useMediaContext } from '../context/MediaContext'
import secureLocalStorage from 'react-secure-storage';

const MyPhotos = ({ userId, userName }) => {
    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));
    const { getMedia } = useMediaContext();
    const [photos, setPhotos] = useState(null);

    const FetchPhotos = async () => {
        const res = await getMedia(userId, null, 9);
        setPhotos(res);
    }
    useEffect(() => {
        FetchPhotos();
    }, [userId])

    return (
        <div className='myPhotos'>
            <h5>{auth?.id == userId ? 'My' : userName+"'s"} photos</h5>
            <ul>
                {photos == null ? <div className='loader_Post' /> : (photos.length > 0 ?
                    photos.map((photo) => (
                        <li>
                            <img src={`https://buzzinguniverse.com/backend/${photo.file}`} alt className="s1" />
                        </li>
                    ))
                    :
                    <p>Sorry! There's no photos found.</p>
                )}
            </ul>
        </div>
    )
}

export default MyPhotos
