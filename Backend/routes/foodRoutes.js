const express = require ('express')
const router = express.Router()
const {homepageFood , viewFood} = require('../controllers/foodController')

//route to fetch fooditem details and show on home page

router.get("/listed-items", homepageFood);

//route to view pet

router.get("/view/:itemId", viewFood);


module.exports=router
