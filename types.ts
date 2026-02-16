export type FontFamily = 'Roboto' | 'Oswald' | 'Anton' | 'Montserrat' | 'Lato' | 'Open Sans';
export type TextAlignment = 'left' | 'center' | 'right';
export type VerticalPosition = 'top' | 'center' | 'bottom';

export interface TextLayer {
  text: string;
  fontSize: number;
  fontFamily: FontFamily;
  color: string;
  isBold: boolean;
  isItalic: boolean;
  showShadow: boolean;
  shadowColor: string;
  showOutline: boolean;
  outlineColor: string;
  outlineWidth: number;
  alignment: TextAlignment;
}

export interface ThumbnailConfig {
  title: TextLayer;
  subtitle: TextLayer;
  overlayOpacity: number;
  overlayColor: string;
  verticalPosition: VerticalPosition;
  padding: number;
}

export const DEFAULT_CONFIG: ThumbnailConfig = {
  title: {
    text: "AMAZING VIDEO TITLE",
    fontSize: 100,
    fontFamily: 'Anton',
    color: '#ffffff',
    isBold: false,
    isItalic: false,
    showShadow: true,
    shadowColor: '#000000',
    showOutline: true,
    outlineColor: '#000000',
    outlineWidth: 4,
    alignment: 'center'
  },
  subtitle: {
    text: "Subtitles goes here...",
    fontSize: 60,
    fontFamily: 'Roboto',
    color: '#facc15', // Yellow-400
    isBold: true,
    isItalic: false,
    showShadow: true,
    shadowColor: '#000000',
    showOutline: true,
    outlineColor: '#000000',
    outlineWidth: 2,
    alignment: 'center'
  },
  overlayOpacity: 0.3,
  overlayColor: '#000000',
  verticalPosition: 'center',
  padding: 60
};