import React from 'react';
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react';

type AuthFormProps = {
  view: 'login' | 'signup';
  setView: (view: 'login' | 'signup') => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  handleSignup: (e: React.FormEvent) => void;
  handleLogin: (e: React.FormEvent) => void;
};

const AuthForm: React.FC<AuthFormProps> = ({
  view,
  setView,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  handleSignup,
  handleLogin,
}) => {
  const isLogin = view === 'login';
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          {isLogin ? <LogIn className="w-12 h-12 text-blue-500" /> : <UserPlus className="w-12 h-12 text-blue-500" />}
        </div>
        <h1 className="text-2xl font-bold text-white text-center mb-8">{isLogin ? 'Login to Video Chat' : 'Create Account'}</h1>
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => setView(isLogin ? 'signup' : 'login')} className="text-blue-400 hover:text-blue-300 text-sm">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
