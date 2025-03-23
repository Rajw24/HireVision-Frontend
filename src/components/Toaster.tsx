import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#024aad',
          color: '#fff',
        },
        success: {
          style: {
            background: '#024aad',
          },
        },
        error: {
          style: {
            background: '#DC2626',
          },
        },
      }}
    />
  );
}