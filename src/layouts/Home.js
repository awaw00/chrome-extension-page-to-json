import React from 'react';

function Home ({
  children
}) {
  return (
    <div style={{padding: '12px', minWidth: '430px'}}>
      {children}
    </div>
  );
}

export default Home;
