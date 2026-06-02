import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'flowbite-react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import router from './router';

const customTheme = {
  button: {
    color: {
      purple: 'bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-300',
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
