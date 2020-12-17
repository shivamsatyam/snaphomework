const express = require('express')
const routes = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const principle_data = require('./principle')
const teachercode = require('./teachercode.js')
const studentcode = require('./studentcode.js')
const student = require('./student.js')
const Html5Entities = require('html-entities').Html5Entities

routes.use(session({
	secret:"shivam",
	resave:false,
	saveUninitialized:true,
	store:new MongoStore({
		mongooseConnection:mongoose.connection,
		ttl:14*24*60*60
	})
}))

mongoose.connect('mongodb://localhost/snaphomework',{useNewUrlParser:true,useUnifiedTopology:true}).then(
	()=>{
		console.log('teacher The connection succesfully established')
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
	image:{
		type:String,
		required:true
	}
	


})



const model = new mongoose.model("teacher",inputSchema)


const Storage = multer.diskStorage({
	destination:'./public/upload',
	filename:(req,file,cb)=>{
		cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
	}
})

const upload = multer({
	storage:Storage
}).single('file')


routes.get('/teacher',(req,res)=>{
	console.log(req.session)
	res.render('teachersignup')
})

const saving =  async(req,res)=>{
	// console.log(req.body)
	try{
		

		if (req.body.password==req.body.cpassword){
			const hash = await bcrypt.hash(req.body.password,10)
			const newUser =  await new model({
				name:Html5Entities.encode(req.body.name),
				email:Html5Entities.encode(req.body.email),
				password:hash,
				schoolname:Html5Entities.encode(req.body.schoolname),				
				image:req.file.filename


		})

			
			console.log(req.session)

			
			req.session.save(function (err) {
				console.log('session save')
			})

			newUser.save((err,req)=>{
			if (err){ throw err}else{
					res.redirect("/login")		
			}

		
		})
		

		}


		
	}
	catch(err){
		console.log('A exception occured '+err)
	}
}


routes.get('/dashboard',(req,res)=>{
	if (req.session.name!=undefined){
		// console.log(req.session)
		if(req.session.type=="teacher"){
			console.log('session')
			teachercode.find({name:req.session.name,email:req.session.email},{_id:0,__v:0},(err,data)=>{
				console.log(typeof(data))
				// console.log(data)
				res.render('teacher_dashboard',{image:req.session.image,name:Html5Entities.decode(req.session.name),email:req.session.email,data:data})

			})
		}else{
			const session_code = req.session.code
			studentcode.find({code:session_code},(err,data)=>{
				if(err) throw err;
				data.forEach((e) => {
				  e.text = Html5Entities.decode(e.text)
				  e.name = Html5Entities.decode(e.name)
				  
				})
				res.render('student_dashboard.ejs',{data:data})	
			})
			
		}
	}else{
		res.redirect('/')
	}

})

routes.get('/logout',(req,res)=>{
	req.session.destroy()
	res.redirect('/')
})


routes.post('/teacher',upload,(req,res,next)=>{
	saving(req,res)	
})


routes.post('/dashboard',(req,res)=>{
	const new_code = new teachercode({
		name:req.session.name,
		email:req.session.email,
		code:req.body.grade,
		password:String(Date.now()).slice(2,13)
	})

	new_code.save((err,data)=>{
		console.log('save')
	})
	res.redirect("/dashboard")
})


routes.get('/delete/:code/:name',(req,res)=>{
	teachercode.deleteOne({code:req.params.code},(err,data)=>{
		res.redirect('/dashboard')
	})
})



const code_Storage = multer.diskStorage({
	destination:'./public/codes',
	filename:(req,file,cb)=>{
		cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
	}
})

const code_upload = multer({
	storage:code_Storage
}).single('code_image')



routes.post('/text',code_upload,async(req,res,next)=>{

	console.log(req.body)
	const grades = req.body.grade.split(',')[1]
	const codes = req.body.grade.split(',')[0]
	const student_text_schema = new studentcode({
		name:req.session.name,
		image:req.session.image,
		code:codes,
		grade:grades,
		text:Html5Entities.encode(req.body.text),
		codeimage:req.file.filename
	})

	student_text_schema.save((err,data)=>{
		if (err){
			console.log(err)
			res.redirect('/')
		}else{
			res.redirect('/dashboard')		
		}
	})

	
})

routes.post('/image',async(req,res)=>{

	console.log(req.body)
	const grades = req.body.grade.split(',')[1]
	const codes = req.body.grade.split(',')[0]
	const student_text_schema = new studentcode({
		name:req.session.name,
		image:req.session.image,
		code:codes,
		grade:grades,
		text:Html5Entities.encode(req.body.text),
		
	})

	student_text_schema.save((err,data)=>{
		if (err){
			console.log(err)
			res.redirect('/')
		}else{
			res.redirect('/dashboard')		
		}
	})

	
})


routes.get('/login',(req,res)=>{
	res.render('login.ejs')
})
// 				req.session.type = "teacher"
// 				req.session.name = data.email
// 				req.session.email = req.body.email
// 				req.session.image = data.image


routes.post('/login',async (req,res)=>{
	try {
		const email = Html5Entities.encode(req.body.email);
		const password  = req.body.password;
		const userEmail =  await model.findOne({email:email})
		console.log(userEmail)
		if(bcrypt.compare(password,userEmail.password)){
			
			req.session.type = "teacher"
			req.session.name = userEmail.name
			req.session.email = req.body.email
			req.session.image = userEmail.image
			res.redirect('/dashboard')

		}else{
			res.send("Password does not match")
		}
		// res.send(userEmail)

	} catch(e) {
		console.log(e);
		res.status(400).send("Invalid entry input")
	}
})





routes.get('/student',(req,res)=>{
	console.log(req.session)
	res.render('studentsignup')
})

const student_saving =  async(req,res)=>{
	// console.log(req.body)
	try{
		

		if (req.body.password==req.body.cpassword){
			const hash = await bcrypt.hash(req.body.password,10)
			const newUser =  await new student({
				
 				name:Html5Entities.encode(req.body.name),
 				email:req.body.email,
 				password:hash,
 				schoolcode:req.body.code
		})

				
			newUser.save((err,re)=>{
				if (err) throw err;
				res.redirect('/studentlogin')
			})
		}


		
	}
	catch(err){
		console.log('A exception occured '+err)
	}
}


// name:req.body.name,
// 				email:req.body.email,
// 				password:hash,
routes.post('/student',(req,res)=>{
	console.log(req)
	student_saving(req,res)	
})

routes.get('/studentlogin',(req,res)=>{
	res.render('studentlogin')
})

routes.post('/studentlogin',async (req,res)=>{
	try {
		const email = req.body.email;
		const password  = req.body.password;
		const userEmail =  await student.findOne({email:email})
		const codedata = await teachercode.findOne({password:userEmail.schoolcode})
		console.log(userEmail)
		if(bcrypt.compare(password,userEmail.password)){
			
			if(codedata){
				console.log(codedata)
				req.session.type = "student"
				req.session.name = userEmail.name
				req.session.email =  email
				req.session.code = userEmail.schoolcode
				res.redirect("/dashboard")
			}else{
				res.send("invalid code")
			}
			

		}else{
			res.send("Password does not match")
		}
		// res.send(userEmail)

	} catch(e) {
		console.log(e);
		res.status(400).send("Invalid entry input")
	}
})

routes.get('/studentdata/:id',(req,res)=>{
	studentcode.find({_id:req.params.id},(err,data)=>{
		console.log(data[0])
		data[0].text = Html5Entities.decode(data[0].text)
		data[0].name = Html5Entities.decode(data[0].name)
		
		if(data[0].codeimage=="0"){
			res.render('studentdata_text',{data:data})
		}else{
			res.render('studentdata_image',{data:data})
		}
		
	})

})




module.exports = routes




