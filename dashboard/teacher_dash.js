const express = require('express')
const routes = express.Router()


routes.get('/dashboard',(req,res)=>{
	console.log(req.session)
	console.log('session')
	res.render('teacher_dashboard')
})



module.exports = routes































