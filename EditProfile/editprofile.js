import {onAuthStateChanged,auth,doc,db,getDoc,ref,storage,uploadBytesResumable,setDoc,getDownloadURL} from '../firebaseconfig.js'

const userName = document.getElementById('userName')
const firstName = document.getElementById('firstName')
const lastName = document.getElementById('lastName')
// const email = document.getElementById('email')
const profilePicture = document.getElementById('profilePicture')
const editBtn = document.getElementById('editBtn')
let currentLoggedInUser;

// console.log(userName);
// console.log(firstName);
// console.log(lastName);
// console.log(email)
// console.log(profilePicture);
// console.log(editBtn);

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


async function getuserdata(uid){
    try{
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            const{Firstname,surname,emailinfo} = docSnap.data()
            userName.value = Firstname + ''+ surname
            firstName.value = Firstname 
            lastName.value = surname
            // email.innerText = emailinfo 
            // console.log(userNameData)
            console.log(docSnap.data())
        }else{
            console.log('kuch nahi mil rahah')
        }       
    }catch(error){
        console.log(error)
    }
}

editBtn.addEventListener('click', editProfileHandler)

function editProfileHandler(){
    // console.log(editProfileHandler)
    console.log(userName.value,firstName.value,lastName.value,profilePicture.files[0])

    const file = profilePicture.files[0]
    

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
                await setDoc(doc(db, "users", currentLoggedInUser), {
                    Firstname: firstName.value,
                    surname: lastName.value,
                    userName: userName.value,
                    profilePicture: downloadURL
                });
            });
        }
    );
}


