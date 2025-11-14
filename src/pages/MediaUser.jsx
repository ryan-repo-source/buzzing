import React, { useEffect, useState } from 'react'
import AddAlbum from '../components/AddAlbum';
import { FaSearch } from 'react-icons/fa';
import { useMediaContext } from '../context/MediaContext';
import AlbumBox from '../components/AlbumBox';
import UploadMedia from '../components/UploadMedia';
import MediaBox from '../components/MediaBox';
import AlbumOptionsDropdown from '../helpers/AlbumOptionsDropdown';
import secureLocalStorage from 'react-secure-storage';
import EditAlbum from '../components/EditAlbum';

const MediaUser = ({ userId }) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'wmv'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];

    const auth = JSON.parse(secureLocalStorage.getItem('auth_data'));

    const [showAddPopup, setAddPopup] = useState(false);
    const [uploadMedia, setUploadMedia] = useState(false);
    const [search, setSearch] = useState('');
    const [media, setMedia] = useState(null);
    const [photos, setPhotos] = useState(null);
    const [videos, setVideos] = useState(null);
    const [musics, setMusics] = useState(null);
    const [loading, setLoading] = useState(false);

    const [AlbumId, setAlbumId] = useState(null);
    const [edit, setEdit] = useState(false);
    const [AlbumData, setAlbumData] = useState(null);
    const { albums, getAlbums, getMedia } = useMediaContext();

    useEffect(() => {
        if (AlbumId) {
            (async function () {
                setLoading(true);
                const media = await getMedia(userId, AlbumId.albums.id);
                setAlbumData(media);
                setLoading(false);
            })()
        }
    }, [AlbumId]);


    const SearchClick = (e) => {
        e.preventDefault();
    }

    const FilterData = (data) => {
        if (!data) return;
        setPhotos(data.filter((d) => imageExtensions.includes(d.type)));
        setVideos(data.filter((d) => videoExtensions.includes(d.type)));
        setMusics(data.filter((d) => audioExtensions.includes(d.type)));
    }

    useEffect(() => {
        FilterData(media);
        if (AlbumId) {
            (async function () {
                setLoading(true);
                const media = await getMedia(userId, AlbumId.albums.id);
                setAlbumData(media);
                setLoading(false);
            })()
        }
    }, [media]);

    const fetchData = async () => {
        getAlbums(userId);
        const media = await getMedia(userId);
        setMedia(media);
        FilterData(media);
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    return (
        <div className="personal_right_box">
            <ul className="nav nav-pills pb-0" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">All <span className="countSpan">{media?.length || 0}</span></button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Albums <span className="countSpan">{albums?.length || 0}</span></button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Photos <span className="countSpan">{photos?.length || 0}</span></button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-friends-tab" data-bs-toggle="pill" data-bs-target="#pills-friends" type="button" role="tab" aria-controls="pills-friends" aria-selected="false">Videos <span className="countSpan">{videos?.length || 0}</span></button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-Groups-tab" data-bs-toggle="pill" data-bs-target="#pills-Groups" type="button" role="tab" aria-controls="pills-Groups" aria-selected="false">Musics <span className="countSpan">{musics?.length || 0}</span></button>
                </li>
            </ul>
            <div className='topWraperMedia'>
                <div className='row'>
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="search-groups-box">
                            <form>
                                <input type="text" placeholder="Search Topics..." onChange={(e) => { setSearch(e.target.value) }} />
                                <div className="search-groups-box-icon">
                                    <button type="submit" onClick={SearchClick}><FaSearch /></button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12">
                        {userId == auth?.id && <div className='btn-wrpttr'>
                            <button onClick={() => setAddPopup(true)}>Add Albums</button>
                            <button onClick={() => setUploadMedia(true)}>Upload</button>
                        </div>}
                    </div>
                </div>
            </div>
            {uploadMedia && <UploadMedia albums={albums} user_id={userId} fetchData={fetchData} getAlbums={getAlbums} setUploadMedia={setUploadMedia} />}
            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                    <div className='emptyBox'>
                        <h3>Media Gallery</h3>
                        {media == null ? <div className='col-md-7 mt-5 pt-5'><div className='loader_Post' /></div> : (media.length > 0 ?
                            <div className='row col-md-8 mt-4'>{
                                media.map((med) => (
                                    <div className='col-lg-4 col-md-6'><MediaBox media={med} userId={userId} fetchData={fetchData} /></div>
                                ))
                            }</div>
                            :
                            <p>Sorry !! There's no media found for the request !!</p>
                        )}
                    </div>
                </div>
                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div className='emptyBox'>
                        {AlbumId && <span className='backbtns' onClick={() => { setAlbumId(null); setEdit(false); setAlbumData(null) }}><i class="fas fa-caret-left"></i> Albums List</span>}
                        {(AlbumId && auth?.id == userId) && <AlbumOptionsDropdown setAlbumData={setAlbumData} setEdit={setEdit} setAlbumId={setAlbumId} fetchData={fetchData} AlbumId={AlbumId} />}
                        {!edit && <h3>{AlbumId ? AlbumId.albums.title : 'Album List'}</h3>}
                        {edit ? <EditAlbum setEdit={setEdit} getAlbums={getAlbums} userId={userId} EditData={AlbumId} /> : <>
                            {
                                AlbumData == null ? albums == null || loading ? <div className='col-md-7 mt-5 pt-5'><div className='loader_Post' /></div> : (albums.length > 0 ?
                                    <div className='row col-md-8 mt-4'>{
                                        albums.map((alb) => (
                                            <div className='col-lg-4 col-md-6' onClick={() => setAlbumId(alb)}><AlbumBox album={alb} /></div>
                                        ))
                                    }</div>
                                    :
                                    <p>Sorry !! There's no albums found for the request !!</p>
                                ) : (AlbumData.length > 0 ? <div className='row col-md-8 mt-4'>{
                                    AlbumData.map((med) => (
                                        <div className='col-lg-4 col-md-6'><MediaBox media={med} userId={userId} fetchData={fetchData} /></div>
                                    ))
                                }</div> : <p>Sorry !! There's no albums found for the request !!</p>)
                            }
                        </>}
                    </div>
                </div>
                <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-friends-tab">
                    <div className='emptyBox'>
                        <h3>All Photos</h3>
                        {photos == null ? <div className='col-md-7 mt-5 pt-5'><div className='loader_Post' /></div> : (photos.length > 0 ?
                            <div className='row col-md-8 mt-4'>{
                                photos.map((med) => (
                                    <div className='col-lg-4 col-md-6'><MediaBox media={med} userId={userId} fetchData={fetchData} /></div>
                                ))
                            }</div>
                            :
                            <p>Sorry !! There's no photos found for the request !!</p>
                        )}
                    </div>
                </div>
                <div className="tab-pane fade" id="pills-friends" role="tabpanel" aria-labelledby="pills-friends-tab">
                    <div className='emptyBox'>
                        <h3>All Videos</h3>
                        {videos == null ? <div className='col-md-7 mt-5 pt-5'><div className='loader_Post' /></div> : (videos.length > 0 ?
                            <div className='row col-md-8 mt-4'>{
                                videos.map((med) => (
                                    <div className='col-lg-4 col-md-6'><MediaBox media={med} userId={userId} fetchData={fetchData} /></div>
                                ))
                            }</div>
                            :
                            <p>Sorry !! There's no videos found for the request !!</p>
                        )}
                    </div>
                </div>
                <div className="tab-pane fade" id="pills-Groups" role="tabpanel" aria-labelledby="pills-Groups-tab">
                    <div className='emptyBox'>
                        <h3>All Musics</h3>
                        {musics == null ? <div className='col-md-7 mt-5 pt-5'><div className='loader_Post' /></div> : (musics.length > 0 ?
                            <div className='row col-md-8 mt-4'>{
                                musics.map((med) => (
                                    <div className='col-lg-4 col-md-6'><MediaBox media={med} userId={userId} fetchData={fetchData} /></div>
                                ))
                            }</div>
                            :
                            <p>Sorry !! There's no musics found for the request !!</p>
                        )}
                    </div>
                </div>
            </div>
            {showAddPopup && <AddAlbum setAddPopup={setAddPopup} getAlbums={getAlbums} userId={userId} />}
        </div>
    )
}

export default MediaUser
