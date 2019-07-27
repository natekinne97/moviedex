require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors   = require('cors');
const helmet = require('helmet');
const moviedex = require('./movies-data.json')

console.log(process.env.API_TOKEN);
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
// handle authentication
app.use(function validateBearerToken(req, res, next){
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('key');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // next function
    next();
});


// handle all of the searching 
function handleGetMovie(req, res){
    let response = moviedex;
    const genre = req.query.genre,
        country = req.query.country,
        vote = req.query.vote;
    
    // genre
    if(genre){
    //    search for genre
        response = response.filter(movie =>{
           if(movie.genre.toLowerCase().includes(genre.toLowerCase())){
            //    I tried doing it like in the example 
            // but It wasnt returning anything at all
               return movie;
           }
        });
    }if(country){
        response = response.filter(movie =>{
            if(movie.country.toLowerCase().includes(country.toLowerCase())) return movie;
        });
    } if (vote) {
        let i=0;
        response = response.filter(movie => {
            if (movie.avg_vote >= Number(vote)) return movie;
        });
    }

    res.json(response);
}

app.get('/movie', handleGetMovie);

// initialize server
app.listen(8000, ()=>{
    console.log('server started');
});