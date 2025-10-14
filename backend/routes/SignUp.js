import express from "express" ;
const router = express.Router() ;

router.get('/',(req,res) => {
    res.send("signup") ;
})

export default router ;