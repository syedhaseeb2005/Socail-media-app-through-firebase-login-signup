                // yah modal ko call karwaya hai
const modal = document.querySelector('.modal')
const overlay = document.querySelector('.overlay')
const crossbtn = document.querySelector('.fa-xmark')
// console.log(modal)
// console.log(overlay)
// console.log(crossbtn)

                // yah sari input call karwai hai 
const newaccountbtn = document.querySelector('.newaccountlogin')
const emaillogin = document.querySelector('#Email')
const passwordinput = document.querySelector('#password')
const Firstname = document.querySelector('#firstname')
const surname = document.querySelector('#surname')
const emailinfo = document.querySelector('#email-info')
const passwordinfo = document.querySelector('#password-info')
// const dateHandler = document.querySelector('#dateHandler')
// const monthhandler = document.querySelector('#monthhandler')
// const yearhandler = document.querySelector('#yearhandler')
// console.log(yearhandler)
// console.log(newaccountbtn)
// console.log(emaillogin)
// console.log(passwordinput)
// console.log(Firstname)
// console.log(surname)
// console.log(emailinfo)
// console.log(numinfo)
// console.log(passwordinfo)

// const user = JSON.parse(localStorage.getItem('user')) || []

                // yah button call karway gy
const loginbtn = document.querySelector('.login-btn')
const signupbtn = document.querySelector('.signup')
loginbtn.addEventListener('click', loginhandler)
signupbtn.addEventListener('click' , signbtnhandler)

// console.log(signupbtn)
console.log(newaccountbtn)
newaccountbtn.addEventListener('click',()=>{
    modal.classList.remove('hidden')
    overlay.classList.remove('hidden')
})
overlay.addEventListener('click',()=>{
    modal.classList.add('hidden')
    overlay.classList.add('hidden')
})
crossbtn.addEventListener('click',()=>{
    modal.classList.add('hidden')
    overlay.classList.add('hidden')
})


import {db,auth,signInWithEmailAndPassword,createUserWithEmailAndPassword,setDoc,doc} from './firebaseconfig.js'

// for login
async function loginhandler(){
    
const response = await signInWithEmailAndPassword(auth, emaillogin.value, passwordinput.value)
    try{
        const users = response.user;
        if(users){
            window.location.href = '../dashboard/dashboardindex.html'
        }
        alert('Welcome You Are Loged in')
        
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        
    }

}

// for signup

async function signbtnhandler(){
        // console.log(signuphandler)
        try {
            const response = await  createUserWithEmailAndPassword(auth, emailinfo.value, passwordinfo.value)
            console.log(response);
            if(response){
                console.log(response.user)
                adduserhandler(response.user.uid)
            }
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            
        }
    }
        
        async function adduserhandler(uid) {
            try {
            const response = await setDoc(doc(db, "users", uid), {
               Firstname : Firstname.value,
               surname : surname.value,
               emailinfo : emailinfo.value,
               passwordinfo : passwordinfo.value,
               uid
            });
            alert("you are signup success")
            
        } catch (e) {
            console.error(e);
        }
        modal.classList.toggle('hidden')
        overlay.classList.toggle('hidden')
    }
    signupbtn.addEventListener('click', signbtnhandler)


    


// function getgenderhandler(g){
//     console.log(g)
//     gender = g
// }








