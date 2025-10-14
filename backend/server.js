import express from 'express' ;
import cors from 'cors' ;
import signup from './pages/SignUp.js'
const app = express() ;

app.get('/',(req,res) => {
    res.send('hello World') ;
})

app.use('/signup',signup) ;

app.listen(3000,()=>{
    console.log('Express has been started ')
})