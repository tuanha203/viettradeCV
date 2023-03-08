const express = require("express");
const app = express();
process.title = 'myApp';
app.get('/',(req, res) => {
    res.json({
        msg: 'Hello world ( ports:8000 )'
    })
})

app.listen(8000, ()=>{
    console.log('Hello docker 8000');
})