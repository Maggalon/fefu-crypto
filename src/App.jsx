import { useContext, useState } from 'react';

import Profile from './pages/Profile';
import Home from './pages/Home';
import BottomMenu from './components/BottomMenu'
import { Tokens } from './pages/Tokens';
import Feedback from './pages/Feedback';
import { FefuCryptoContext } from './context/FefuCryptoContext';
import { PacmanLoader } from 'react-spinners';

const App = () => {

  const [page, setPage] = useState("profile")

  const { isLoading } = useContext(FefuCryptoContext)

  return (
    <main className='flex flex-col items-center p-5 mt-20 mb-40'>      
      
      {!isLoading && page == "profile" && <Profile />}
      
      {!isLoading && page == "home" && <Home />}

      {!isLoading && page == "tokens" && <Tokens />}

      {!isLoading && page == 'feedback' && <Feedback />}
      
      {isLoading && <PacmanLoader size={40} color='#ffffff' />}

      <BottomMenu setPage={setPage}
                  page={page} />

    </main>
  )
}

export default App
