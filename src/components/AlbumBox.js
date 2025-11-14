import React from 'react'

const AlbumBox = ({ album }) => {
    const GetImage = () => {
        const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'wmv'];
        const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];

        let image = `https://buzzinguniverse.com/backend/${album.last_media.file}`;

        if (videoExtensions.includes(album.last_media.type)) {
            image = "/images/video_thumb.png"
        } else if (audioExtensions.includes(album.last_media.type)) {
            image = "/images/audio_thumb.png"
        }

        return image;
    }
    return (
        <div className='albumBox'>
            <span>{album.media_count}</span>
            <img src={album.last_media ? GetImage() : '/images/image_thumb.png'} />
            <h4>{album.albums.title}</h4>
        </div>
    )
}

export default AlbumBox
