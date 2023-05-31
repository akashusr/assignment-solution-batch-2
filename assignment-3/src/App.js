
import './output.css';
import Homepage from './components/Homepage';
import { useState } from 'react';
import Header from './components/Header';
import CartPage from './components/CartPage';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {
  const [isCartPage, setIsCartPage] = useState(false)
  return (
    <Provider store={store} >
      <Header setIsCartPage={setIsCartPage} />
      <main className="py-16">
        {!isCartPage ?
          <Homepage />
          :
          <CartPage />
        }
      </main>
    </Provider>

  );
}

export default App;
