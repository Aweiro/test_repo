import '@/styles/index.scss';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { HeaderProvider } from '@/modules/shared/layout/Header/context/HeaderContext';
import { Header } from '@/modules/shared/layout/Header';
import { Footer } from '@/modules/shared/layout/Footer';

function App({ Component, pageProps }: AppProps) {

  return (
    <Provider store={store}>
      <div className='App'>
        <HeaderProvider>
          <Header />
        </HeaderProvider>
        <main className='App-content'>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </Provider>
  );
}

export default App;
