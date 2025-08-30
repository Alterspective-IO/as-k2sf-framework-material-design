/**
 * ValidationPanel Component
 * Displays validation errors and warnings
 */

import { h, Component } from 'preact';
import { ValidationResult } from '../types';

interface ValidationPanelProps {
  results: ValidationResult;
  onDismiss: () => void;
}

export class ValidationPanel extends Component<ValidationPanelProps> {
  render() {
    const { results, onDismiss } = this.props;
    
    if (!results || (results.errors.length === 0 && results.warnings.length === 0)) {
      return null;
    }
    
    return (
      <div class="validation-panel">
        <div class="validation-panel__header">
          <h4>Validation Results</h4>
          <button class="validation-panel__close" onClick={onDismiss}>×</button>
        </div>
        
        {results.errors.length > 0 && (
          <div class="validation-panel__errors">
            <h5>Errors ({results.errors.length})</h5>
            {results.errors.map((error, index) => (
              <div key={index} class="validation-item validation-item--error">
                <span class="validation-item__icon">⚠️</span>
                <div class="validation-item__content">
                  <strong>{error.field}</strong>
                  <p>{error.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {results.warnings.length > 0 && (
          <div class="validation-panel__warnings">
            <h5>Warnings ({results.warnings.length})</h5>
            {results.warnings.map((warning, index) => (
              <div key={index} class="validation-item validation-item--warning">
                <span class="validation-item__icon">⚡</span>
                <div class="validation-item__content">
                  <strong>{warning.field}</strong>
                  <p>{warning.message}</p>
                  {warning.suggestion && (
                    <p class="validation-item__suggestion">💡 {warning.suggestion}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}