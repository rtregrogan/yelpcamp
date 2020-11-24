const express = require("express");
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
});

const port = 3000 || process.env.PORT;
app.listen(port, () => {
    console.log(`running on port ${port}`)
})