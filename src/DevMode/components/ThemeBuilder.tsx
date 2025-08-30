/**
 * ThemeBuilder Component
 * Visual theme configuration interface
 */

import { h, Component } from 'preact';
import { ThemeBuilderProps, ThemeConfiguration } from '../types';

export class ThemeBuilder extends Component<ThemeBuilderProps> {
  render() {
    const { theme, onThemeChange, onPresetSelect } = this.props;
    
    return (
      <div class="theme-builder">
        <div class="theme-builder__presets">
          <h4>Theme Presets</h4>
          <div class="theme-builder__preset-grid">
            <button 
              class={`theme-preset ${theme.preset === 'light' ? 'theme-preset--active' : ''}`}
              onClick={() => onPresetSelect('light')}
            >
              <div class="theme-preset__preview theme-preset__preview--light"></div>
              <span>Light</span>
            </button>
            <button 
              class={`theme-preset ${theme.preset === 'dark' ? 'theme-preset--active' : ''}`}
              onClick={() => onPresetSelect('dark')}
            >
              <div class="theme-preset__preview theme-preset__preview--dark"></div>
              <span>Dark</span>
            </button>
            <button 
              class={`theme-preset ${theme.preset === 'high-contrast' ? 'theme-preset--active' : ''}`}
              onClick={() => onPresetSelect('high-contrast')}
            >
              <div class="theme-preset__preview theme-preset__preview--contrast"></div>
              <span>High Contrast</span>
            </button>
          </div>
        </div>
        
        <div class="theme-builder__colors">
          <h4>Colors</h4>
          <div class="theme-builder__color-grid">
            <div class="theme-color">
              <label>Primary</label>
              <input 
                type="color" 
                value={theme.colors.primary}
                onInput={(e) => onThemeChange({ 
                  colors: { ...theme.colors, primary: (e.target as HTMLInputElement).value }
                })}
              />
            </div>
            <div class="theme-color">
              <label>Background</label>
              <input 
                type="color" 
                value={theme.colors.background}
                onInput={(e) => onThemeChange({ 
                  colors: { ...theme.colors, background: (e.target as HTMLInputElement).value }
                })}
              />
            </div>
          </div>
        </div>
        
        <button class="theme-builder__reset" onClick={() => this.props.onReset()}>
          Reset to Default
        </button>
      </div>
    );
  }
}