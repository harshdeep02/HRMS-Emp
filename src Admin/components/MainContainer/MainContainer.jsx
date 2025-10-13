import './MainContainer.scss';

const MainContainer = ({ children, islogin }) => {
  return (
    <>
      
        <main className={`${islogin ? 'main-container' : ''}`}>
          <div className={`${islogin ? 'main-content' : ''}`}>
            {children}
          </div>
        </main>
      
    </>
  );
};

export default MainContainer;
