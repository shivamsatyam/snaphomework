const express = require('express')
const routes = express.Router()


routes.get('/parent',(req,res)=>{
	res.render('parentsignup')
})



module.exports = routes




