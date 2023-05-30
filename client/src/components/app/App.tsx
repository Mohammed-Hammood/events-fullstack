import React from 'react';
import Pages from 'pages';
import { Header, useFetchUser } from 'components';
import { ScrollToTop } from 'components';
import "styles/modal.scss";


function App() {
  useFetchUser();

  return (
    <>
      <Header />
      <Pages />
      <ScrollToTop />
    </>
  );
}

export default App;
