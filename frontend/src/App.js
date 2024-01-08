import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Chat from './components/Chat';
import Nav from './components/Nav';
import { usePubNub } from 'pubnub-react';
function App() {
  const pubnub = usePubNub();
  return (
    <Router>
      <div>
        <Nav/>
      </div>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>

  );
}

export default App;
