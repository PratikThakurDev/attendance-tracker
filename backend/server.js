import express from 'express' ;
const app = express() ;

app.get('/',(req,res) => {
    res.send('hello World') ;
})

app.listen(3000,()=>{
    console.log('Express has been started ')
})