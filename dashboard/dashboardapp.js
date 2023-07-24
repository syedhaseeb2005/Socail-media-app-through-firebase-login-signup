
import {auth,doc,onAuthStateChanged,signOut,db,getDoc,addDoc,collection,getDocs,setDoc,ref,storage,uploadBytesResumable,getDownloadURL} from "../firebaseconfig.js";

const logoutBtn = document.querySelector('.logout-btn')
// console.log(logoutBtn)
const usernameHTML = document.getElementById('userName')
const emailAddressHTML = document.getElementById('emailAddress')
const firstNameHTML = document.getElementById('firstName')
const lastnameHTML = document.getElementById('lastName')
// console.log(username,emailAddress,firstName,lastname)
const inputPost = document.querySelector('.inputPost')
// console.log(inputPost)
const postBtn = document.querySelector('.post-btn')
// console.log(postBtn)
const PostingPart = document.querySelector('.Posting-part')
// console.log(PostingPart)
const postinput = document.getElementById('postinput')
// console.log(postinput)
const time = document.querySelector('#time')
// console.log(time);
const img1 = document.querySelector('.img-1')
// console.log(img1);
const img2 = document.querySelector('.img-2')
const menu = document.querySelector('.menu')
// console.log(menu);
const uploadImg = document.querySelector('.upload-img')
// console.log(uploadImg) 
const navbar1 = document.querySelector('.navbar-1')

img1.addEventListener('click', imghandler)

function imghandler(){
    // console.log(imghandler)
    navbar1.classList.toggle('hidden')
}






getPosts()
let currentLoggedInUser

onAuthStateChanged(auth,(user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);
        getuserdata(uid)
        currentLoggedInUser = uid
    } else {
        window.location.href = "../index.html" 
    }
});

logoutBtn.addEventListener('click', logoutBtnHanlder) 


// logout user
function logoutBtnHanlder(){
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("signout successfully")
        window.location.href = '../index.html'
    }).catch((error) => {
        // An error happened.
    });
}


async function getuserdata(uid){
    try{
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            const{Firstname,surname,emailinfo,profilePicture} = docSnap.data()
            usernameHTML.innerHTML = Firstname +''+ surname
            firstNameHTML.innerHTML = Firstname
            lastnameHTML.innerHTML = surname
            emailAddressHTML.innerHTML = emailinfo || 'No Email Updated'
            img2.src = profilePicture || '../assests/download.png'
            console.log(profilePicture)
            // console.log(img1.src)
            
            // console.log(docSnap.data())
            // console.log(firstNameHTML,usernameHTML,lastnameHTML,emailAddressHTML)
        }else{
            console.log('kuch nahi mil rahah')
        }       
    }catch(error){
        console.log(error)
    }
}

postBtn.addEventListener('click', postBtnHandler)

async function postBtnHandler(){

    const file = uploadImg.files[0]
    // Create the file metadata
    /** @type {any} */
    const metadata = {
        contentType: 'image/jpeg'
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log('File available at', downloadURL);
                 try {
                    const response = await addDoc(collection(db, "posts"), {
                    postcontent: postinput.value,
                    authorId: currentLoggedInUser,
                    PostImgUrl: downloadURL
                });
        // console.log(response.id)
                    getPosts()
                    postinput.value = ''
                 } catch (error) {
                 console.error(error);
                }
            });
        }
    );
}

    // console.log(postBtnHandler)
    // try {
    //     const response = await getDocs(collection(db, "posts"), {
    //         postcontent: postinput.value,
    //         authorId: currentLoggedInUser
    //     });
    //     // console.log(response.id)
    //     getPosts()
    //     postinput.value = ''
    // } catch (error) {
    //     console.error(error);
    // }


async function getPosts(){
    try {
        PostingPart.innerHTML = ''
        const querySnapshot = await getDocs(collection(db, "posts"));
        querySnapshot.forEach(async (doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            const { authorId, postcontent, PostImgUrl } = doc.data()
            
            const authorDetails = await getAuthorData(authorId)
            
            const postElement = document.createElement('div')
            postElement.setAttribute('click', 'd-flex flex-column')
            console.log(usernameHTML)
            const content = 
            ` <img src="${authorDetails.profilePicture}" width="70px" alt="">
            <h5 id="user">${authorDetails?.Firstname}${authorDetails?.surname}</h5>
            <h5 id="email">${authorDetails?.emailinfo || 'No Email Updated'}</h5>
            <h5 id="time">${new Date().getHours()}h</h5>
            <hr>
            <h4 class="Inputtext">${postcontent}</h4>
            <img src="${PostImgUrl}" style="object-fit: cover;margin-top: 10px;width: 500px; " alt="">
            <div class="forlike">
            <i class="fa-regular fa-heart"><span style="margin-left: 5px;">20</span></i>
            <span style="display: flex;justify-content: space-between;">
            <h5 style="margin-top: 15px;margin-right: 10px;">20 comment</h5>
            <h5 style="margin-top: 15px;">20 shares</h5>
            </span>
            </div>
            <hr>
            <div class="for-like-comment-share">
            <i class="fa-regular fa-heart"><span style="margin-left: 5px;">Likes</span></i>
            <i class="fa-regular fa-comment" style="margin-top: 20px;"><span style="margin-left: 5px;">Comment</span></i>
            <i class="fa-solid fa-share" style="margin-top: 20px;"><span style="margin-left: 5px;">Share</span></i>
            </div>
            <br>
            <br>`
            postElement.innerHTML = content
            PostingPart.appendChild(postElement)
        })
    } catch (error) {
        console.log(error)  
    }
}


async function getAuthorData(authorUid) {
    // console.log(authorUid, "==>>authorUid")
    
    
    const docRef = doc(db, "users", authorUid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        return docSnap.data()
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}
