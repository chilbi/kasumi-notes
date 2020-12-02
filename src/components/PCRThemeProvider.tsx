import { useState, useMemo } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';
import { PCRThemeContext, State } from './Contexts';
import localValue, { PCRTheme } from '../localValue';
import UDMarugoOtf from '../fonts/FOT-UDMarugo_LargePro-B.otf';
import HanziPenTtf from '../fonts/DF-HanziPen-W5.ttf';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    rankColor: Record<1 | 2 | 4 | 7 | 11 | 18, string>;
  }
  interface ThemeOptions {
    rankColor?: Record<1 | 2 | 4 | 7 | 11 | 18, string>;
  }
}

function createTheme(pcrTheme: PCRTheme) {
  return createMuiTheme({
    rankColor: {
      1: '#94b5ee',
      2: '#f0ac8a',
      4: '#adb5ce',
      7: '#f4b039',
      11: '#a14ce5',
      18: '#d72d3e',
    },
    spacing: (abs: number | string) =>
      typeof abs === 'string' ? abs
        : abs === 0 ? '0' : `${0.25 * abs}rem`,
    palette: {
      primary: { main: '#5f96f5' },
      secondary: { main: '#f84e90' },
    },
    typography: {
      fontFamily: (pcrTheme.fontFamily ? `"${pcrTheme.fontFamily}",` : '') + '"Arial","Microsoft YaHei","黑体","宋体",sans-serif',
      fontSize: pcrTheme.fontSize,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '@global': {
            '@font-face': [{
              fontFamily: 'Marugo',
              fontStyle: 'normal',
              fontWeight: 700,
              src: `url(${UDMarugoOtf}) format("opentype")`,
            }, {
              fontFamily: 'Hanzi Pen',
              fontStyle: 'normal',
              fontWeight: 400,
              src: `url(${HanziPenTtf}) format("truetype")`,
            }],
            'body': {
              fontWeight: pcrTheme.fontWeight,
            },
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            fontFamily: 'inherit',
            fontWeight: 700,
          },
        }
      },
      MuiTab: {
        styleOverrides: {
          root: {
            fontFamily: 'inherit',
            fontWeight: 700,
          },
        }
      },
    },
  });
}

interface PCRThemeProviderProps {
  children?: React.ReactNode;
}

function PCRThemeProvider(props: PCRThemeProviderProps) {
  const [value, set] = useState(() => localValue.app.theme.get());
  const state: State<PCRTheme> = useMemo(() => [value, set] as any, [value]);
  const theme = useMemo(() => {
    return createTheme(value);
  }, [value]);
  return (
    <PCRThemeContext.Provider value={state}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </PCRThemeContext.Provider>
  );
}

export default PCRThemeProvider;
