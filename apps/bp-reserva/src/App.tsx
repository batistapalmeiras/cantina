// Libs
import { ModalContainer, ToastContainer } from 'bp-ui';
// Local
import { AppRouter } from './routes';

function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer />
      <ModalContainer />
    </>
  );
}

export default App;
