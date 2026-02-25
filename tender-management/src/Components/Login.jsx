import { useState, useEffect, useRef } from 'react';
import logo from '../assest/logo.svg';
import login from '../assest/login.svg';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import '../CSS/Login.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState('login');
  const [forgotUsername, setForgotUsername] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetAuthToken, setResetAuthToken] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Enter' && !loading) {
        if (view === 'login' && username && password) {
          handleLogin(e);
        } else if (view === 'forgot' && forgotUsername.trim()) {
          handleForgotPassword(e);
        } else if (view === 'reset' && otp.join('').length === 6) {
          handleVerifyOtp(e);
        } else if (view === 'reset-password' && newPassword.length >= 8) {
          handleResetPassword(e);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [username, password, forgotUsername, otp, newPassword, loading, view]);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        username,
        password,
      });
      if (response.status === 200) {
        toast.success('Logged in successfully!', { duration: 3000 });
        sessionStorage.setItem('token', response.data.token);
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (error) {
      toast.error('Invalid Credentials!', { duration: 3000 });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotUsername.trim()) {
      toast.error('Please enter your username.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/forgot-password`,
        null,
        { params: { username: forgotUsername } }
      );
      setResetToken(response.data.resetToken);
      toast.success('OTP sent! Check your email.');
      setView('reset');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send OTP.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/verify-reset-otp`, {
        username: forgotUsername,
        otp: otpValue,
        resetToken: resetToken,
      });
      setResetAuthToken(response.data.resetAuthToken);
      toast.success('OTP verified successfully!');
      setView('reset-password');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to verify OTP.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/reset-password`, {
        username: forgotUsername,
        newPassword,
        resetAuthToken,
      });
      toast.success('Password updated successfully! Please login.');
      setView('login');
      setForgotUsername('');
      setOtp(['', '', '', '', '', '']);
      setNewPassword('');
      setResetToken('');
      setResetAuthToken('');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to reset password.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const isForgotOrReset = view === 'forgot' || view === 'reset' || view === 'reset-password';
  return (
    <div className="container-fluid overflow-hidden">
      <div className="row justify-content-center align-items-center g-20" style={{ height: '100vh' }}>
        <div className="login-container col-lg-8 col-md-8 col-sm-12 h-100 d-flex flex-column justify-content-center align-items-md-center">
          <div className="w-50 sm:w-100">
            <div className="mb-4 d-flex flex-row align-items-center justify-content-around">
              <img src={logo} alt="logo" className="logo w-35 sm:w-30" />
            </div>
            <div className="logo-text me-3 text-nowrap">
              <span style={{ color: '#005197' }}>Tactive</span> Project Management Software
            </div>
            {view === 'login' && (
              <>
                <div className="login-title mb-5 mt-4">Login to your Account</div>
                <div className="fw-bold mb-5 mt-2 text-start">
                  <div htmlFor="username" className="login-username">
                    Username <span style={{ color: 'red' }}>*</span>
                  </div>
                  <input
                    type="text"
                    className="login-form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your Username"
                    required
                  />
                </div>

                <div className="fw-bold mb-3 text-start position-relative">
                  <div className="login-password">
                    Password <span style={{ color: 'red' }}>*</span>
                  </div>
                  <input
                    type={visible ? 'text' : 'password'}
                    className="login-form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="**********"
                    required
                  />
                  <span className="eye-icon" onClick={() => setVisible(!visible)}>
                    {visible ? <Eye size={25} /> : <EyeOff size={25} />}
                  </span>
                </div>

                <div className="d-flex justify-content-end mb-5">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    style={{ textDecoration: 'none', color: 'red', fontSize: '15px' }}
                    onClick={() => { setView('forgot'); setForgotUsername(''); }}
                  >
                    Forgot password ?
                  </button>
                </div>

                <div>
                  <button
                    className="custom-btn"
                    onClick={handleLogin}
                    disabled={!username || !password}
                  >
                    {loading ? <span className="spinner-border text-white" /> : 'Login'}
                  </button>
                </div>
              </>
            )}

            {view === 'forgot' && (
              <>
                <div className="login-title mb-5 mt-5">Forgot Password</div>

                <div className="fw-bold mb-5 mt-2 text-start">
                  <div className="login-username">
                    Username <span style={{ color: 'red' }}>*</span>
                  </div>
                  <input
                    type="text"
                    className="login-form-control"
                    id="forgotUsername"
                    value={forgotUsername}
                    onChange={(e) => setForgotUsername(e.target.value)}
                    placeholder="Enter your Username"
                    required
                  />
                </div>

                <div className="mb-4">
                  <button
                    className="custom-btn"
                    onClick={handleForgotPassword}
                    disabled={!forgotUsername.trim() || loading}
                  >
                    {loading ? <span className="spinner-border text-white" /> : 'Send OTP'}
                  </button>
                </div>

                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    style={{ textDecoration: 'none', color: '#005197', fontSize: '14px' }}
                    onClick={() => setView('login')}
                  >
                    ← Back to Login
                  </button>
                </div>
              </>
            )}
            {view === 'reset' && (
              <>
                <div className="login-title mb-4 mt-5">Verify OTP</div>
                <p className="text-center text-muted mb-4" style={{ fontSize: '14px' }}>
                  Enter the 6-digit OTP sent to your registered email.
                </p>

                <div className="d-flex justify-content-center gap-2 mb-5">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="otp-box"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                    />
                  ))}
                </div>
                <div className="mb-4">
                  <button
                    className="custom-btn"
                    onClick={handleVerifyOtp}
                    disabled={otp.join('').length < 6 || loading}
                  >
                    {loading ? <span className="spinner-border text-white" /> : 'Verify OTP'}
                  </button>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    style={{ textDecoration: 'none', color: '#005197', fontSize: '14px' }}
                    onClick={() => setView('forgot')}
                  >
                    ← Back
                  </button>
                </div>
              </>
            )}
            {view === 'reset-password' && (
              <>
                <div className="login-title mb-4 mt-5">Reset Password</div>
                <p className="text-center text-muted mb-4" style={{ fontSize: '14px' }}>
                  Set your new password below.
                </p>

                <div className="fw-bold mb-4 text-start position-relative">
                  <div className="login-password">
                    New Password <span style={{ color: 'red' }}>*</span>
                  </div>
                  <input
                    type={newPasswordVisible ? 'text' : 'password'}
                    className="login-form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                  />
                  <span className="eye-icon" onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
                    {newPasswordVisible ? <Eye size={25} /> : <EyeOff size={25} />}
                  </span>
                </div>
                <div className="mb-4">
                  <button
                    className="custom-btn"
                    onClick={handleResetPassword}
                    disabled={newPassword.length < 8 || loading}
                  >
                    {loading ? <span className="spinner-border text-white" /> : 'Reset Password'}
                  </button>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    style={{ textDecoration: 'none', color: '#005197', fontSize: '14px' }}
                    onClick={() => setView('reset')}
                  >
                    ← Back
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="login-section col-lg-4 col-md-4 col-sm-12 h-100 d-flex flex-wrap align-content-center justify-content-center">
          <div className="w-100 d-flex justify-content-center mb-4">
            <img src={login} alt="login" className="login-section-img w-100 mb-5" />
          </div>
          <div className="w-100">
            <p className="login-section-text-1 mt-3">Project Management</p>
          </div>
          <div className="w-100">
            <p className="login-section-text-2">Streamline Your Projects. Maximize Your Success</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
