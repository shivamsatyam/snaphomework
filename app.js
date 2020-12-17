const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000 
const teacher = require('./login/teacher.js')
const parent = require('./login/parent.js')
const principle = require('./login/principle.js')
const student = require('./login/student.js')
const teacher_dash = require('./dashboard/teacher_dash.js')

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
const static_path = path.join(__dirname,'public')
app.use(express.static(static_path))

app.get("/",(req,res)=>{
	res.render('index')
})

app.get('/teacher',teacher)
app.get('/parent',parent)
app.get('/principle',principle)
app.get('/student',teacher)
app.get('/login',teacher)
app.get('/studentlogin',teacher)

//Post requests

app.post('/principle',principle)
app.post('/teacher',teacher)
app.post('/student',teacher)
app.post('/studentlogin',teacher)



//Dashboard get request
app.get('/dashboard',teacher)

app.get('/logout',teacher)

app.post('/dashboard',teacher)

app.get('/delete/:code/:name',teacher)
app.post('/text',teacher)
app.post('/login',teacher)

app.get('/studentdata/:id',teacher)
app.post('/image',teacher)
app.listen(port,()=>{
	console.log('this is the listen port')
})





































