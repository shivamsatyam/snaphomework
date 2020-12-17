let classcode = document.querySelector('.classcode')
let classcode_btn = document.getElementById('classcode')
let classcode_cancel_btn = document.querySelector('#btn-sm2')

let grade_btn = document.querySelector('.add-new-grade')
let grading_class_btn = document.querySelector('.class-code-add-section')

let text = document.getElementById('text')
let image = document.getElementById('image')
let image_area = document.querySelector('.image')
let text_area = document.querySelector('.text') 
classcode_btn.addEventListener('click',(e) => {

  	classcode.classList.toggle('classcode-remove')
});


classcode_cancel_btn.addEventListener('click',(e) => {
  	classcode.classList.toggle('classcode-remove')
  	grading_class_btn.style.display = 'none'
  	
});

grade_btn.addEventListener('click',(e) => {
  	grading_class_btn.style.display = 'flex'
});



let plus_btn = document.querySelector('.plus')
let updates = document.querySelector('.updates')

plus_btn.addEventListener('click',(e) => {
  	updates.classList.toggle('updates-delete')	
});


image.addEventListener('click',(e) => {
  	text_area.classList.toggle('text-delete')
});


text.addEventListener('click',(e) => {
  	image_area.classList.toggle('image-delete')
});



















