const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config()

//initialize Server
const app = express()
// initialize Port (externe server||local)
const PORT = process.env.PORT || 5000
// listening to server at Port (externe server Port||local port)
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})

// Define static folder 
app.use(express.static('public'))

// Define view engine
app.set('view engine', 'ejs')


// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

//first route

app.get('/', (req, res) => {
    res.redirect('/movies/1')
})
// app.get('/movies/1', (req, res) => {
//     res.render('pages/index')
// })
app.get('/movies/:id', (req, res) => {
    console.log(req.params.id)
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=${req.params.id}`)
        .then(result => result.json())
        .then(data => {
            res.render('pages/index', { page: Number(req.params.id), data: data.results })
        })
})

app.get('/movieDetails/:id', (req, res) => {
    console.log(req.params.id)
    fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
        .then(result => result.json())
        .then(data => {
            res.render('pages/movieDetails', { data })
        })
})
app.post('/search', (req, res) => {
    console.log(req.body.searchInput)
    res.redirect(`/search/${req.body.searchInput}/1`)
})

app.get('/search/:word/:page', (req, res) => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${req.params.word}&page=${req.params.page}&include_adult=false`)
        .then(result => result.json())
        .then(data => {
            console.log(data);
            res.render('pages/index', { data: data.results, page: req.params.page })
        })
})
