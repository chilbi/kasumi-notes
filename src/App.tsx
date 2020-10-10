import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';
import { HashRouter as Router } from 'react-router-dom';
import PCRDBProvider from './components/PCRDBProvider';
import Main from './components/Main';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PCRDBProvider>
        <Router>
          <Main />
        </Router>
      </PCRDBProvider>
    </ThemeProvider>
  );
}

export default App;
