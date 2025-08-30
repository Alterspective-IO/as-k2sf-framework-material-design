/**
 * LoadingOverlay Component
 * Provides visual feedback during async operations
 */

import { h, Component } from 'preact';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  progress?: number;
  type?: 'spinner' | 'bar' | 'dots';
  overlay?: boolean;
}

export class LoadingOverlay extends Component<LoadingOverlayProps> {
  render() {
    const { 
      visible, 
      message = 'Loading...', 
      progress, 
      type = 'spinner',
      overlay = true 
    } = this.props;
    
    if (!visible) {
      return null;
    }
    
    return (
      <div class={`loading-overlay ${overlay ? 'loading-overlay--overlay' : ''}`}>
        <div class="loading-overlay__content">
          {this.renderLoader(type, progress)}
          {message && (
            <div class="loading-overlay__message">{message}</div>
          )}
          {progress !== undefined && (
            <div class="loading-overlay__progress">{Math.round(progress)}%</div>
          )}
        </div>
      </div>
    );
  }
  
  private renderLoader(type: string, progress?: number) {
    switch (type) {
      case 'bar':
        return (
          <div class="loading-bar">
            <div 
              class="loading-bar__fill"
              style={{ width: `${progress || 0}%` }}
            />
          </div>
        );
        
      case 'dots':
        return (
          <div class="loading-dots">
            <span class="loading-dots__dot"></span>
            <span class="loading-dots__dot"></span>
            <span class="loading-dots__dot"></span>
          </div>
        );
        
      case 'spinner':
      default:
        return (
          <div class="loading-spinner">
            <svg class="loading-spinner__svg" viewBox="0 0 50 50">
              <circle
                class="loading-spinner__circle"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke-width="4"
              />
            </svg>
          </div>
        );
    }
  }
}

// CSS for loading overlay
export const loadingOverlayStyles = `
.loading-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.loading-overlay--overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loading-overlay__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-overlay__message {
  font-size: 14px;
  color: #424242;
  font-weight: 500;
}

.loading-overlay__progress {
  font-size: 18px;
  color: #667eea;
  font-weight: 600;
}

/* Spinner */
.loading-spinner {
  width: 40px;
  height: 40px;
}

.loading-spinner__svg {
  animation: rotate 2s linear infinite;
  width: 100%;
  height: 100%;
}

.loading-spinner__circle {
  stroke: #667eea;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* Progress Bar */
.loading-bar {
  width: 200px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.loading-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

/* Dots */
.loading-dots {
  display: flex;
  gap: 8px;
}

.loading-dots__dot {
  width: 12px;
  height: 12px;
  background: #667eea;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

.loading-dots__dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots__dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  30% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}
`;