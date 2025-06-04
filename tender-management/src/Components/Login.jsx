import React ,{useState} from 'react';
import logo from '../assest/logo.svg';
import login from '../assest/login.svg';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import '../CSS/Login.css';
function Login() {
    const [username, setUsername] =useState('');
    const [password, setPassword] =useState('');
    const [error, setError] =useState('');
    const [visible, setVisible] = useState(false);
    const handleLogin = async (e) => {
      e.preventDefault();
      if (!username && !password) {
        setError('Login credentials missing');
      }
      try{
        const response=await axios.post('',{
        username: username,
        password: password
      });
      if(response.status === 200) {
        sessionStorage.setItem('token', response.data.token); 
      }
      }
      catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Invalid Credentials');
        } 
      }
    };
  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center g-20" style={{ height: '100vh' }}>
        <div className="col-lg-8 col-md-8 col-sm-12 h-100 d-flex flex-column justify-content-center align-items-center">
            <div className="w-50">
                <div className='mb-5 d-flex flex-row '>
                    <img src={logo} alt="logo" className='logo w-35' />
                    <div className='logo-text me-3'><span style={{color:'#005197'}}>Tender</span> Management <br />Module</div>
                </div>
                <div className='login-title mb-5 mt-5'>
                  Login to your Account
                </div>
                {error && <p className="error mb-4">{error}</p>}
                <div className=' mb-4 mt-2'>
                    <label htmlFor="username">Username <span style={{color:"red"}}>*</span></label>
                    <input type="text" className='login-form-control' id='username' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter your Username' required/>
                </div>
                <div className=' mb-2'>
                    <label htmlFor="password">Password <span style={{color:"red"}}>*</span></label>
                    <input type={visible? "text":"password"} className='login-form-control' id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='**********' required/>
                    <span className="eye-icon" onClick={() => setVisible(!visible)}>
                    {visible ? <Eye size={25} /> : <EyeOff size={25} />}
                    </span>
                </div>
                <div className='d-flex justify-content-end mb-4'>
                  <a href="#" style={{textDecoration:'none',color:'red', fontSize:'17px'}}>Forgot password ?</a>
                </div>
                <div> 
                  <button className='custom-btn' onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
        <div className="login-section col-lg-4 col-md-4 col-sm-12 h-100 d-flex flex-wrap align-content-center justify-content-center">
          <div className='w-100'>
             <img src={login} alt="login" className='login-section-img w-100 mb-5'/>
          </div>
          <div className='w-100'>
             <p className='login-section-text-1 mt-5'>
              Tenant Management Module
             </p>
          </div>
          <div className='w-100'>
             <p className='login-section-text-2'>
              Streamline Your Tenders. Maximize Your Wins
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
