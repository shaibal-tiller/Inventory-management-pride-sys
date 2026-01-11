import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import loginIcon from '../assets/loginicon.png';
import loginIllustration from '../assets/Login.png';

/**
 * LoginPage Component
 * Handles user authentication with a modern, split-screen design
 */
export default function LoginPage() {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    // Form state management
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Handles form submission and user authentication
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.login({
                username: formData.username,
                password: formData.password,
                stayLoggedIn: formData.rememberMe,
            });

            const mockUser = {
                id: '1',
                name: formData.username.split('@')[0],
                email: formData.username,
                groupId: 'default',
                groupName: 'My Inventory',
            };

            setAuth(response.token, response.attachmentToken, mockUser);
            navigate('/inventory');

        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 items-center justify-center p-12">
                <div className="max-w-md">
                    <img
                        src={loginIllustration}
                        alt="Home Inventory Organization"
                        className="w-full h-auto drop-shadow-2xl"
                    />
                    <div className="mt-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Organize Your Home
                        </h2>
                        <p className="text-gray-600">
                            Keep track of your belongings, warranties, and important documents all in one secure place.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-between p-8">
                <div className="w-full max-w-md flex-1 flex flex-col justify-center">
                    {/* App Logo & Title */}
                    <div className="text-center mb-8">
                        <img
                            src={loginIcon}
                            alt="Home Inventory"
                            className="w-16 h-16 mx-auto mb-4"
                        />
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Home Inventory
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Track and organize your things
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                            Sign in to your account
                        </h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({ ...formData, username: e.target.value })
                                    }
                                    placeholder="Enter your username"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">Remember me</span>
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        {/* Register Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Create one
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="w-full max-w-md text-center mt-8">
                    <p className="text-xs text-gray-500 mb-2">Version 1.2.4</p>
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                        <a href="#" className="hover:text-gray-700">Help Center</a>
                        <span>•</span>
                        <a href="#" className="hover:text-gray-700">Privacy Policy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-gray-700">Terms of Service</a>
                    </div>
                </div>
            </div>
        </div>
    );
}