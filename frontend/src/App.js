import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar/navbar';
import AppRouter from './router/appRouter';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}

export default App;
