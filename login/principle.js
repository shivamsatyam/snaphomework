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
		required:true
	},

	schoolcode:{
		type:String,
		required:true,
		unique:true
	},
	image:{
		type:String,
		required:true
	}

})



const model = new mongoose.model("principle",inputSchema)


const Storage = multer.diskStorage({
	destination:'./public/upload',
	filename:(req,file,cb)=>{
		cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
	}
})

const upload = multer({
	storage:Storage
}).single('file')


routes.get('/principle',(req,res)=>{
	res.render('principlesignup')
})

const saving =  async(req,res)=>{
	console.log(req.body)
	try{
		

		if (req.body.password==req.body.cpassword){
			const hash = await bcrypt.hash(req.body.password,4)
			const newUser = await new model({
				name:req.body.name,
				email:req.body.email,
				password:hash,
				schoolname:req.body.schoolname,
				schoolcode:req.body.schoolcode,
				image:req.file.filename

		})
			newUser.save((err,req)=>{
			if (err) throw err;
			res.redirect('/')
		})
		

		}


		
	}
	catch(err){
		console.log('A exception occured '+err)
	}
}


routes.post('/principle',upload,(req,res,next)=>{
	saving(req,res)	

})


module.exports = routes




