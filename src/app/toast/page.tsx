'use client';

import { toast } from 'react-toastify';

const ToastPage = () => {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => toast.success('성공!')}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          성공 (Success)
        </button>
        <button
          onClick={() => toast.error('실패!')}
          style={{
            backgroundColor: '#F44336',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          에러 (Error)
        </button>
        <button
          onClick={() => toast.info('알림!')}
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          정보 (Info)
        </button>
        <button
          onClick={() => toast.warn('경고!')}
          style={{
            backgroundColor: '#FFC107',
            color: 'black',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          경고 (Warning)
        </button>
        <button
          onClick={() => toast('기본!')}
          style={{
            backgroundColor: '#607D8B',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          기본 (Default)
        </button>
      </div>
    </div>
  );
};

export default ToastPage;
