export const SubmitSuccess = () => {
  const handleGoHome = () => {
    localStorage.removeItem('interviewApp_User');
    window.location.href = '/'; 
  };

  return (
    <div className="success-container">
      <div className="success-emoji"></div>
      <h1 className="success-title">Interview completed!</h1>
      <p className="success-text">
        Thank you for spending your time. <br/>
        Your records have been sent to the server successfully.
      </p>
      
      <button 
        onClick={handleGoHome}
        className="btn btn-primary"
        style={{ marginTop: '30px' }} 
      >
        Return to homepage
      </button>
    </div>
  );
};