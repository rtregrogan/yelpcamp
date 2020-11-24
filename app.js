const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

mongoose.connect('mongodb+srv://admin:TriskelioN12@cluster0.o9j4k.mongodb.net/yelpcamp?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true})
    .then(() => {
        console.log('connection open!');
    })
    .catch(() => {
        console.log('error');
    })



const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//to parse the req.body on a post request
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//get the home page
app.get('/', (req, res) => {
    res.render('home')
});

//finding all campgrounds
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});

//route to render the form to add campground then showing the campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
//post route to add a campground to the server
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})
//showing a campground
app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


const port = 3000 || process.env.PORT;
app.listen(port, () => {
    console.log(`running on port ${port}`)
})