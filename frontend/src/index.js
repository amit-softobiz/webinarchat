import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
const root = ReactDOM.createRoot(document.getElementById('root'));
const pubnub = new PubNub({
  publishKey: 'pub-c-5761a7b0-5039-46c1-bc4a-3cec24d32319',
  subscribeKey: 'sub-c-3ad06afd-cb10-4175-a952-435f7b9f56f1',
  cryptoModule: PubNub.CryptoModule.aesCbcCryptoModule({ cipherKey: 'pubnubenigma' }),
  userId: "default",

});
root.render(
  <PubNubProvider client={pubnub}>
    <App />
  </PubNubProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
