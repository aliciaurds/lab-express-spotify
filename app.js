require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const router = express.Router();

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('/', router); //!--> sin esto me salia el error cannot get, segun vi esto se utiliza para decirle a Express a utilizar router para todas las rutas con la raiz "/"
const favicon = require("serve-favicon")
app.use(favicon(__dirname + "/public/images/favicon.ico" ))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
//Homepage
router.get("/",(req, res, next) =>{
    res.render("home")
})
//search
router.get("/artist-search", (req, res, next) =>{
    spotifyApi
  .searchArtists(req.query.artistName)
  .then((data) => {
    console.log('The received data from the API: ', data.body.artists.items);
    //!Tuve que acceder a  data.body.artists.items para ver mejor los detalles pues son diferentes de la documentación
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render("artist-search-results.hbs", {
        oneArtist : data.body.artists.items
    })
  })
  .catch((err) => {
    next(err)
    console.log('The error while searching artists occurred: ', err)
});

})
router.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data)=>{
        console.log("Received album data:", data.body.items);
        res.render("albums.hbs", {
         artistAlbum : data.body.items
        })
    })
    .catch((err)=>{
        next(err)
    })
    
  });


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

