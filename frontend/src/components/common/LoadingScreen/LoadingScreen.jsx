const LoadingScreen = () => {
  return (
    <div className="w-full h-full bg-white flex items-center justify-center gap-20">
      <div className="max-w-xl w-80 h-80 flex items-center justify-center">
        <img src="/logo.png" alt="Logo" className="w-full h-full" />
      </div>
      <div>
        <h1>Loading...</h1>
      </div>
    </div>
  );
};

export default LoadingScreen;
