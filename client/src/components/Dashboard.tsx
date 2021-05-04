// @ts-nocheck
import { Container, Form } from "react-bootstrap";
import {useState, useEffect} from 'react'
import useAuth from "../hooks/useAuth";
import SpotifyWebApi from 'spotify-web-api-node';
import { TrackResult } from "./TrackResult";
import axios from 'axios';
import { Player } from "./Player";

interface Props {
    code: string 
}

interface TrackProps  {
    albumUrl: string
    artist: string
    url: string
    title: string
}

const spotifyApi = new SpotifyWebApi({
    clientId: '37ec29812fbc40f5842f30bba8c04273'
})

const Dashboard: React.FC<Props> = ({ code }): JSX.Element => {
    const accessToken = useAuth(code);
    const [search, setSearch] = useState<string>('');
    const [lyrics, setLyrics] = useState<string>('');
    const [searchResult, setSearchResult] = useState<TrackProps[]>([]);
    const [playTrack, setPlayTrack] = useState<[]>([]);

    function chooseTrack(track) {
        setPlayTrack(track);
        setSearch('')
        setLyrics('')
    }
    useEffect(()=>{
        if(!accessToken) return
        spotifyApi.setAccessToken(accessToken);
    },[accessToken])

    useEffect(() => {
        if(!accessToken) return
        if(!search) return setSearchResult([]);
        let cancel = false
        spotifyApi.searchTracks(search)
        .then(res=> {
            if(cancel) return 
            setSearchResult(res.body.tracks?.items.map(track => {
              const smallestAlbumImages = track.album.images.reduce((smallest, image) => {
                  if(image.height < smallest.height) return image
                  return smallest
              }, track.album.images[0])
            return {
                artist: track.artists[0].name,
                title: track.name,
                url: track.uri,
                albumUrl: smallestAlbumImages.url
            }
          }))
        })
        return () => cancel = true
    },[search, accessToken])

    useEffect(()=>{
        if(!playTrack) return
        axios.get('http://localhost:3001/lyrics', {
            params: {
                track: playTrack.title,
                artist: playTrack.artist
            }
        })
        .then(res=> {
            setLyrics(res.data.lyrics)
        })
    },[playTrack])
    return (
        <div>
            <Container className="d-flex flex-column">
                <h1>Dashboard</h1>
                <Form.Control type="search" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search music or lyrics"/>
                <div className="flex-grow-1 mt-5">
                    {searchResult.map(track => (
                        <TrackResult track={track} key={track.url} chooseTrack={chooseTrack}/>
                    ))}
                    {searchResult.length===0 && (
                        <div style={{whiteSpace:'pre', textAlign:'center'}}>{lyrics?lyrics:''}</div>
                    )}
                    <Player accessToken={accessToken} trackUri={playTrack?.uri}/>
                </div>
            </Container>
        </div>
    )
}
export default Dashboard;