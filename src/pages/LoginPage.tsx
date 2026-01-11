import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // 1. Perform Login using the form-encoded method that works
            const response = await api.login({
                username: formData.username,
                password: formData.password,
                stayLoggedIn: formData.rememberMe,
            });

            // 2. Define a mock user to satisfy the authStore requirements
            // This avoids calling /v1/users/self for now
            const mockUser = {
                id: '1',
                name: formData.username.split('@')[0],
                email: formData.username,
                groupId: 'default',
                groupName: 'My Inventory',
            };

            // 3. Store tokens and the mock user in the store and localStorage
            // setAuth handles saving to localStorage based on your authStore implementation
            setAuth(response.token, response.attachmentToken, mockUser);

            // 4. Navigate directly to inventory
            navigate('/inventory');

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
                <div className="absolute top-20 left-20 w-64 h-64 bg-primary-500 rounded-full blur-[128px] opacity-10" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-600 rounded-full blur-[128px] opacity-10" />

                <div className="relative flex flex-col items-center justify-center w-full p-12 z-10">
                    <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {/* Shelves illustration placeholder */}
                            <div className="space-y-3">
                                <div className="bg-slate-100 h-20 rounded-lg flex items-center justify-center gap-2 p-3">
                                    <div className="w-12 h-12 bg-blue-200 rounded" />
                                    <div className="w-12 h-12 bg-yellow-200 rounded" />
                                </div>
                                <div className="bg-slate-100 h-20 rounded-lg flex items-center justify-center gap-2 p-3">
                                    <div className="w-12 h-12 bg-green-200 rounded" />
                                    <div className="w-12 h-12 bg-purple-200 rounded" />
                                </div>
                                <div className="bg-slate-100 h-20 rounded-lg flex items-center justify-center gap-2 p-3">
                                    <div className="w-12 h-12 bg-orange-200 rounded" />
                                    <div className="w-12 h-12 bg-teal-200 rounded" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-slate-100 h-20 rounded-lg flex items-center justify-center gap-2 p-3">
                                    <div className="w-12 h-12 bg-red-200 rounded" />
                                    <div className="w-12 h-12 bg-pink-200 rounded" />
                                </div>
                                <div className="bg-slate-100 h-20 rounded-lg flex items-center justify-center gap-2 p-3">
                                    <div className="w-12 h-12 bg-indigo-200 rounded" />
                                    <div className="w-12 h-12 bg-blue-200 rounded" />
                                </div>
                                <div className="bg-slate-100 h-20 rounded-lg flex items-center justify-center gap-2 p-3">
                                    <div className="w-12 h-12 bg-yellow-200 rounded" />
                                    <div className="w-12 h-12 bg-green-200 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                            Organize Everything
                        </h2>
                        <p className="text-slate-600 max-w-md">
                            Keep track of your belongings, warranties, and important documents all in one secure place.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500 rounded-xl shadow-md mb-4">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">
                            Home Inventory
                        </h1>
                        <p className="text-slate-600 text-sm">
                            Track and organize your things
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-6">
                            Sign in to your account
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) =>
                                            setFormData({ ...formData, username: e.target.value })
                                        }
                                        placeholder="Enter your username"
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                                        required
                                    />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                        placeholder="Enter your password"
                                        className="w-full pl-4 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={(e) =>
                                            setFormData({ ...formData, rememberMe: e.target.checked })
                                        }
                                        className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-slate-700">Remember me</span>
                                </label>
                                <a href="#" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 focus:ring-4 focus:ring-primary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <span>Signing in...</span>
                                ) : (
                                    <>
                                        <span>Sign in</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <p className="mt-6 text-center text-sm text-slate-600">
                            Don't have an account?{' '}
                            <a href="#" className="text-primary-500 hover:text-primary-600 font-medium">
                                Create one
                            </a>
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 text-center text-xs text-slate-500 space-x-4">
                        <a href="#" className="hover:text-slate-700">Help Center</a>
                        <span>•</span>
                        <a href="#" className="hover:text-slate-700">Privacy Policy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-slate-700">Terms of Service</a>
                    </div>
                    <p className="mt-2 text-center text-xs text-slate-400">Version 1.2.4</p>
                </div>
            </div>
        </div>
    );
}