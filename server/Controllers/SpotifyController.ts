import SpotifyWebApi from 'spotify-web-api-node';
import lyricsFinder from 'lyrics-finder';
import express from 'express';

class SpotifyController {
    login(req:express.Request, res:express.Response) {
        const code = req.body.code;
        const spotifyApi = new SpotifyWebApi({
            redirectUri: 'http://localhost:3000',
            clientId: '37ec29812fbc40f5842f30bba8c04273',
            clientSecret: 'ab0f51e28ce84ff2b3ed51bff4961a60'
        })
        spotifyApi.authorizationCodeGrant(code)
            .then(data => {
                res.json({
                    accessToken: data.body.access_token,
                    refreshToken: data.body.refresh_token,
                    expiresIn: data.body.expires_in
                })
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            })
    }
    refresh(req:express.Request, res:express.Response) {
        const code = req.body.code;
        const refreshToken = req.body.refreshToken
        const spotifyApi = new SpotifyWebApi({
            redirectUri: 'http://localhost:3000',
            clientId: '37ec29812fbc40f5842f30bba8c04273',
            clientSecret: 'ab0f51e28ce84ff2b3ed51bff4961a60',
            refreshToken
        })
        spotifyApi
            .refreshAccessToken()
            .then(data => {
                res.json({
                    accessToken: data.body.access_token,
                    expiresIn: data.body.expires_in,
                })
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            })
    }
    async lyrics(req:express.Request, res:express.Response) {
        const lyrics = (await lyricsFinder(req.query.artist, req.query.track))
        res.json({ lyrics })
    }
}


export const SpotifyCtrl = new SpotifyController();