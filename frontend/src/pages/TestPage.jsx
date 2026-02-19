const TestPage = () => {
  const handleClick = () => {
    alert('BUTTON WORKS!');
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>Test Page</h1>
      <button onClick={handleClick} style={{ padding: '20px', fontSize: '20px', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
        CLICK ME
      </button>
    </div>
  );
};

export default TestPage;