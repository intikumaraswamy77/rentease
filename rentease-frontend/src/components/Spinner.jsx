import React from 'react';

export default function Spinner({ size = '3rem', color = 'var(--primary-600)' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
      <div 
        style={{
          width: size,
          height: size,
          border: `4px solid ${color}30`,
          borderTop: `4px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}
      ></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ color: 'var(--gray-500)', fontWeight: 500 }}>Loading...</p>
    </div>
  );
}
