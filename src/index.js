import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './context/UserContext';
import { PostProvider } from './context/PostContext';
import { ForumProvider } from './context/ForumContext';
import { MediaProvider } from './context/MediaContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      <PostProvider>
        <ForumProvider>
          <MediaProvider>
            <App />
          </MediaProvider>
        </ForumProvider>
      </PostProvider>
    </AppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
