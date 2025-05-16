import { useNavigate } from 'react-router-dom';

function Navbar() {
    let navigate = useNavigate();
    const handleLogin = () => {
        navigate('/login')
    }
    const handleSignup = () => {
        navigate('/signup')
    }
    return (
        <nav className='fixed top-0 w-full z-50 bg-gradient-to-r from-gray-900 via-blue-950 to-gray-900 shadow-lg border-b border-blue-800'>
            <div className='flex flex-col xs:flex-row items-center justify-between px-2 xs:px-4 sm:px-6 py-2 gap-2 xs:gap-3 sm:gap-0'>
                <div className="flex flex-row items-center gap-2 xs:gap-2 sm:gap-3">
                    <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12">
                        <img src="/images/logo.png" alt="Logo" className="h-full w-full object-contain" />
                    </div>
                    <div className="text-lg xs:text-xl sm:text-2xl font-bold tracking-wider text-blue-300 drop-shadow">CHESS24</div>
                </div>
                <div className='flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 w-full xs:w-auto mt-2 xs:mt-0'>
                    <button onClick={handleLogin} className="text-blue-200 font-semibold py-2 px-4 rounded-full border-2 border-blue-500 hover:bg-blue-800/40 transition w-full xs:w-auto">Login</button>
                    <button onClick={handleSignup} className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-2 px-4 rounded-full shadow hover:from-blue-700 hover:to-blue-500 transition w-full xs:w-auto">Signup</button>
                </div>
            </div>
        </nav>

    )
}

export default Navbar