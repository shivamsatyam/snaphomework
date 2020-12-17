const express = require('express')
const routes = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost/snaphomework',{useNewUrlParser:true,useUnifiedTopology:true}).then(
	()=>{
		console.log('principle The connection succesfully established')
	}
).catch((err)=>{
	console.log(err)
}) 
routes.use(express.urlencoded({extended:false}))
const inputSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true
	},
	schoolname:{
		type:String,
		default:"none"
	},

	schoolcode:{
		type:String,
		default:"none"
	},
	image:{
		type:String,
		default:"none"
	}

})



const model = new mongoose.model("student",inputSchema)



module.exports = model




