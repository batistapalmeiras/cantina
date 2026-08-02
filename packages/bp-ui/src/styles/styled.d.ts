// Libs
import 'styled-components';
import { Theme } from 'bp-kit';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
