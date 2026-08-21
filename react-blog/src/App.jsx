import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import authService from './appwrite/auth.js';
import { login,logout } from './store/authSlice.js';
import { Header,Footer } from './components/index.js';
import './App.css'

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((user) => {
        if (user) {
          dispatch(login(user));
        }
        else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.error('Error fetching current user:', error);
        dispatch(logout());
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return !loading ? (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div>
          <p className="text-2xl font-bold mb-4 text-black">Welcome to the React Blog!</p>
          <Header />

          <Footer />


        </div>
      </div>
    </>
  ): null;
}

export default App
