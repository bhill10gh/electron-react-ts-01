import { createRoot } from 'react-dom/client';
import Hello from './components/Hello';
import './index.css';

const App = () => {
    return (
        <>
        <Hello/>
        </>
    )
};

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element "#root" was not found');
}

const root = createRoot(container);
root.render(<App/>);
