
import React from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'

interface AuthProps {
    accessToken: string
    trackUri: string
}
export const Player = ({accessToken, trackUri}:AuthProps) => {
    const [play, setPlay] = React.useState(false)
    
    React.useEffect(()=>{
        setPlay(true)
    },[trackUri])

    if(!accessToken) return null

    return (
        <SpotifyPlayer
            token={accessToken}
            showSaveIcon
            callback={state=>{
                if(!state.isPlaying) setPlay(false)
            }}
            play={play}
            uris={trackUri ? [trackUri]:[]}
        />
    )
}
