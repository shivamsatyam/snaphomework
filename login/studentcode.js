const mongoose = require('mongoose')




mongoose.connect('mongodb://localhost/snaphomework',{useNewUrlParser:true,useUnifiedTopology:true}).then(
	()=>{
		console.log('teacher The connection succesfully established')
	}
).catch((err)=>{
	console.log(err)
}) 

const a = new Date()

const schema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	image:{
		type:String,
		required:true
	},
	code:{
		type:String,
		required:true
	},
	grade:{
		type:String,
		required:true
	},
	text:{
		type:String
	},

	clap:{
		type:String,
		default:0
	},
	codeimage:{
		type:String,
		default:0
	},
	date:{
		type:String,
		default:a.getDate()
	},
	month:{
		type:String,
		default:a.getMonth()
	},
	year:{
		type:String,
		default:a.getFullYear()
	}

})



module.exports = new mongoose.model('studentcode',schema)
























