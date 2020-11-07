import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';
import { HashRouter } from 'react-router-dom';
import PCRDBProvider from './components/PCRDBProvider';
import CharaListProvider from './components/CharaListProvider';
import CharaDetailProvider from './components/CharaDetailProvider';
import Main from './components/Main';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <PCRDBProvider>
          <CharaListProvider>
            <CharaDetailProvider>
              <Main />
            </CharaDetailProvider>
          </CharaListProvider>
        </PCRDBProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
