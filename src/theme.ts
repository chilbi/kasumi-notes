import { createMuiTheme } from '@material-ui/core/styles'
import UDMarugoOtf from './fonts/FOT-UDMarugo_LargePro-B.otf';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    maxWidth: string;
    rankColor: Record<1 | 2 | 4 | 7 | 11 | 18, string>;
  }
  interface ThemeOptions {
    maxWidth?: string;
    rankColor?: Record<1 | 2 | 4 | 7 | 11 | 18, string>;
  }
}

const theme = createMuiTheme({
  maxWidth: '37.5rem',
  rankColor: {
    1: '#94b5ee',
    2: '#f0ac8a',
    4: '#adb5ce',
    7: '#f4b039',
    11: '#a14ce5',
    18: '#d72d3e',
  },
  spacing: 4,
  palette: {
    primary: { main: '#5f96f5' },
    secondary: { main: '#f84e90' },
  },
  typography: {
    fontFamily: '"Marugo", "Arial","Microsoft YaHei","黑体","宋体",sans-serif',
    fontSize: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@font-face': {
            fontFamily: 'Marugo',
            fontStyle: 'normal',
            fontWeight: 700,
            src: `url(${UDMarugoOtf}) format("opentype")`,
          },
        },
      },
    },
  },
});

export default theme;
