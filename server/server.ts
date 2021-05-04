import express from 'express';
import {SpotifyCtrl} from './Controllers/SpotifyController';
import cors  from 'cors';


const app = express();

app.use(cors());
app.use(express.json())


const PORT = 3001

app.post('/login', SpotifyCtrl.login)
app.post('/refresh', SpotifyCtrl.refresh)
app.get('/lyrics', SpotifyCtrl.lyrics)

app.listen(PORT, ()=>console.log(`the app is running on port ${PORT}`))

