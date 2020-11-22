import React from 'react';
import { HashRouter } from 'react-router-dom';
import PCRThemeProvider from './components/PCRThemeProvider';
import PCRDBProvider from './components/PCRDBProvider';
import CharaListProvider from './components/CharaListProvider';
import CharaDetailProvider from './components/CharaDetailProvider';
import EquipDetailProvider from './components/EquipDetailProvider';
import Main from './components/Main';

function App() {
  return (
    <PCRThemeProvider>
      <HashRouter>
        <PCRDBProvider>
          <CharaListProvider>
            <CharaDetailProvider>
              <EquipDetailProvider>
                <Main />
              </EquipDetailProvider>
            </CharaDetailProvider>
          </CharaListProvider>
        </PCRDBProvider>
      </HashRouter>
    </PCRThemeProvider>
  );
}

export default App;
