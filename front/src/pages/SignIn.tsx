// import { Link } from 'react-router-dom';
import React, {useState } from 'react';
import { Mail} from 'lucide-react';
import { signin } from '../services/signinservice';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FormErrors {
    email: string;
    password: string;
  }

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate= useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<FormErrors>({
        email: '',
        password: '',
      });

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
          email: '',
          password: '',
        };
    
        let isValid = true;
    
        if (!email.trim()) {
          newErrors.email = 'Email is required';
          isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
          newErrors.email = 'Please enter a valid email';
          isValid = false;
        }
    
        if (!password) {
          newErrors.password = 'Password is required';
          isValid = false;
        } else if (password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
          isValid = false;
        }
        setErrors(newErrors);
        return isValid;
      };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setError(null);
        try {
          const response = await signin({ email, password });
          console.log(response.data);
          if (response.data && response.data.adminDto && response.data.token) {
            const { adminDto, token } = response.data;
      
            const user = {
              id: adminDto.id,
              fullname: adminDto.fullName,
              email: adminDto.email,
              phone: adminDto.phoneNumber,
            };
            // localStorage.setItem('user', JSON.stringify(userData));
            // localStorage.setItem('token',token);
            // navigate('/dashboard');
            console.log(user);
            login(user,token);
            navigate("dashboard");
          } else {
            setError('Invalid email or password.');
          }
        }
        catch(err:any){
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
              } else {
                setError('Failed to sign in. Please check your credentials.');
              }
        }
    };

  return (
    <div className="flex w-[1000px] h-[480px] shadow-2xl rounded-3xl overflow-hidden mx-auto my-52">
      {/* Left panel */}
      <div className="w-1/4 bg-zinc-800 text-white flex flex-col justify-between items-start rounded-xl">
  <div className="mb-4">
    <div className="bg-zinc-800 rounded-full p-3 mb-4">
      <Mail className="text-white w-7 h-7 " />
    </div>
    <h2 className="text-4xl font-semibold text-left px-2">
      Get Notified,<br />Stay Informed
    </h2>
  </div>
</div>

       {/* Rotated Image Overlap */}
       <img
        src="https://img.icons8.com/ios-filled/100/FFFFFF/secured-letter.png"
        alt="mail"
        className=" absolute left-[24%] top-1/2 w-60 -translate-y-1/4 -rotate-12 z-30 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
      />
      
      {/* Right panel */}
      <div className="w-3/4 bg-white p-14 ">
        <h2 className="text-4xl font-bold mb-2">Sign in</h2>
        <p className="text-sm text-gray-600 mb-6  border-t pt-2">Enter your details to sign in to your account</p>

        {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

        <form className="space-y-4 " onSubmit={handleSubmit}>
          <div className="space-x-10 ml-6">
          <label className="block font-light  text-white" htmlFor="email">Email</label>
            
            <label className="block font-semibold mb-1 " htmlFor="email">Email</label>
            <input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className={`w-96 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                } border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}

            <label className="block font-semibold mb-1 mt-4" htmlFor="password">Password</label>
            <input
                type="password"
                name="password"
                id="password"
                placeholder="*********"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className={`w-96 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                } border-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}


          </div>

          <div className='flex justify-center items-center '>
          <button type="submit" className="bg-zinc-800 text-white py-2 w-36 rounded-lg text-lg font-semibold hover:bg-blue-600 transition  mt-6">
            Sign in
          </button>
          </div>
        </form>

      </div>
    </div>
     );
}

export default SignIn;
