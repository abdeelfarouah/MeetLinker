import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import JoinRoom from './components/JoinRoom';
import Room from './components/Room';

type User = {
  email: string;
  name: string;
};

type View = 'login' | 'signup' | 'join' | 'room';

function App() {
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({ email, name });
    setView('join');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({ email, name: 'User' });
    setView('join');
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setView('room');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setEmail('');
    setPassword('');
    setName('');
    setRoomCode('');
  };

  return (
    <>
      {view === 'login' || view === 'signup' ? (
        <AuthForm
          view={view}
          setView={setView}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          name={name}
          setName={setName}
          handleSignup={handleSignup}
          handleLogin={handleLogin}
        />
      ) : view === 'join' ? (
        <JoinRoom roomCode={roomCode} setRoomCode={setRoomCode} handleJoinRoom={handleJoinRoom} handleLogout={handleLogout} />
      ) : view === 'room' ? (
        <Room
          roomCode={roomCode}
          handleLogout={handleLogout}
          currentUser={currentUser}
          theme={theme}
          setTheme={setTheme} // Pass setTheme function to Room
        />
      ) : null}
    </>
  );
}

export default App;
