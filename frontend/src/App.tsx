import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import AuthProvider from '@/components/AuthProvider';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Write from '@/pages/Write';
import ArticleView from '@/pages/ArticleView';
import ArticleEdit from '@/pages/ArticleEdit';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Feed from '@/pages/Feed';
import Bookmarks from '@/pages/Bookmarks';
import Search from '@/pages/Search';
import TagView from '@/pages/TagView';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/write" element={<Write />} />
            <Route path="/article/:id" element={<ArticleView />} />
            <Route path="/article/:id/edit" element={<ArticleEdit />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/search" element={<Search />} />
            <Route path="/tag/:name" element={<TagView />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
