
import React from 'react'

interface TrackProps {
    track:TrackUser
    chooseTrack: (track:TrackUser)=>{}
}
type TrackUser = {
    artist: string
    url: string
    title: string
    albumUrl: string
}

export const TrackResult = ({ track, chooseTrack }:TrackProps) => {

    function handlePlay() {
        chooseTrack(track)
    }
    return (
        <div className="d-flex m-1"
            style={{ cursor: 'pointer' }}
            onClick={handlePlay}>
            <img src={track.albumUrl} alt={track.title} />
            <div className="ml-5">
                <div>{track.title}</div>
                <div>{track.artist}</div>
            </div>
        </div>
    )
}
