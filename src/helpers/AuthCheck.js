import  secureLocalStorage  from  "react-secure-storage";

const AuthCheck = () => {
    const auth = secureLocalStorage.getItem('auth_data');
    console.log(auth);
}

export default AuthCheck
