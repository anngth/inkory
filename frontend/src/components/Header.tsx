import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { PenSquare, User, LogOut, Bookmark, Search } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user, logout } = useAuthStore();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold">
            Inkory
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm ${pathname === '/' ? 'text-black' : 'text-gray-600 hover:text-black'}`}
              >
                Home
              </Link>
              <Link
                to="/feed"
                className={`text-sm ${pathname === '/feed' ? 'text-black' : 'text-gray-600 hover:text-black'}`}
              >
                Feed
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/search" className="p-2 hover:bg-gray-100 rounded-full">
                <Search size={20} />
              </Link>
              <Link
                to="/write"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
              >
                <PenSquare size={18} />
                <span className="hidden sm:inline">Write</span>
              </Link>
              <Link
                to="/bookmarks"
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Bookmark size={20} />
              </Link>
              <Link
                to={`/profile/${user.username}`}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <User size={20} />
              </Link>
              <button
                onClick={logout}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-black"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition text-sm"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
