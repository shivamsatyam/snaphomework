const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/snaphomework',{useNewUrlParser:true,useUnifiedTopology:true}).then(
	()=>{
		console.log('teacher The connection succesfully established')
	}
).catch((err)=>{
	console.log(err)
}) 


const schema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	code:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	}
	
})


module.exports = new mongoose.model("teachercode",schema)




























