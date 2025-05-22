import React ,{useState} from 'react';
import axios from 'axios';
import '../CSS/Login.css';
function Login() {
    const [username, setUsername] =useState('');
    const [password, setPassword] =useState('');
    const [error, setError] =useState('');
    const handleLogin=async (e)=>{
        e.preventDefault();
        try{
            const response=await axios()
        }catch{
           
        }
    }
  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center g-20" style={{ height: '100vh' }}>
        <div className="col-lg-8 col-md-6 col-sm-12 h-100 d-flex flex-column justify-content-center align-items-center">
            <div className="w-50">
                <div className='mb-4'></div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className='fw-bold mb-5'>
                    <label htmlFor="username" className='label-username'>Username</label>
                    <input type="text" className='form-control' id='username' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter your Username' required/>
                </div>
                <div className='fw-bold mb-2'>
                    <label htmlFor="password" className='label-password'>Password</label>
                    <input type="password" className='form-control' id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='**********' required/>
                </div>
                <div className='d-flex justify-content-end mb-5'>
                  <a href="#" style={{textDecoration:'none',color:'black'}}>Forgot password</a>
                </div>
                <div> 
                  <button className='custom-btn'>Login</button>
                </div>
            </div>
        </div>
        <div className="login-section col-lg-4 col-md-6 col-sm-12 h-100">
          
        </div>
      </div>
    </div>
  );
}
export default Login;
