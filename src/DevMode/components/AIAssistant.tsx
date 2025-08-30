/**
 * AIAssistant Component
 * Provides intelligent configuration assistance using OpenAI API
 */

import { h, Component, Fragment } from 'preact';
import { 
  AIAssistantProps, 
  AIRequest, 
  AIResponse, 
  AIConversationEntry,
  AISuggestion,
  AIAssistantConfig 
} from '../types';

/**
 * Component state
 */
interface AIAssistantState {
  messages: AIConversationEntry[];
  isLoading: boolean;
  input: string;
  apiKeySet: boolean;
  suggestions: AISuggestion[];
  error: string | null;
  isMinimized: boolean;
  showSettings: boolean;
}

/**
 * AI Assistant Component
 * Integrates with OpenAI to provide configuration help
 */
export class AIAssistant extends Component<AIAssistantProps, AIAssistantState> {
  private messagesEndRef: HTMLDivElement | null = null;
  private inputRef: HTMLTextAreaElement | null = null;
  
  constructor(props: AIAssistantProps) {
    super(props);
    
    this.state = {
      messages: [
        {
          role: 'assistant',
          content: 'Hello! I\'m your AI configuration assistant. I can help you configure your DataTable by understanding your requirements in plain English. For example, you can ask me to "Make the header blue" or "Add a date column that formats dates as MM/DD/YYYY".',
          timestamp: Date.now(),
          applied: false
        }
      ],
      isLoading: false,
      input: '',
      apiKeySet: !!props.config.apiKey,
      suggestions: [],
      error: null,
      isMinimized: false,
      showSettings: false
    };
  }
  
  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }
  
  render() {
    const { 
      messages, 
      isLoading, 
      input, 
      apiKeySet, 
      suggestions, 
      error,
      isMinimized,
      showSettings 
    } = this.state;
    
    return (
      <div class={`ai-assistant ${isMinimized ? 'ai-assistant--minimized' : ''}`}>
        {/* Header */}
        <div class="ai-assistant__header">
          <div class="ai-assistant__header-left">
            <svg class="ai-assistant__icon" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21.928 11.607c-.202-.488-.635-.605-.928-.633V8c0-1.103-.897-2-2-2h-6V4.61c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5c-1.103 0-2 .897-2 2v2.997l-.082.006A1 1 0 0 0 1.99 12v2a1 1 0 0 0 1 1H3v5c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5a1 1 0 0 0 1-1v-1.938a1.006 1.006 0 0 0-.072-.455zM5 20V8h14l.001 3.996L19 12v2l.001.005.001 5.995H5z"/>
              <ellipse cx="8.5" cy="12" rx="1.5" ry="2"/>
              <ellipse cx="15.5" cy="12" rx="1.5" ry="2"/>
              <path fill="currentColor" d="M8 16h8v2H8z"/>
            </svg>
            <h3 class="ai-assistant__title">AI Configuration Assistant</h3>
          </div>
          <div class="ai-assistant__header-actions">
            <button 
              class="ai-assistant__header-btn"
              onClick={() => this.setState({ showSettings: !showSettings })}
              title="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 15.516c1.922 0 3.516-1.594 3.516-3.516S13.922 8.484 12 8.484 8.484 10.078 8.484 12s1.594 3.516 3.516 3.516zm7.453-2.532l2.109.844v2.344l-2.109.844c-.188.75-.469 1.453-.844 2.109l.844 2.109-1.641 1.641-2.109-.844c-.656.375-1.359.656-2.109.844l-.844 2.109h-2.344l-.844-2.109c-.75-.188-1.453-.469-2.109-.844l-2.109.844-1.641-1.641.844-2.109c-.375-.656-.656-1.359-.844-2.109L2.39 14.172v-2.344l2.109-.844c.188-.75.469-1.453.844-2.109l-.844-2.109 1.641-1.641 2.109.844c.656-.375 1.359-.656 2.109-.844L11.203 2.39h2.344l.844 2.109c.75.188 1.453.469 2.109.844l2.109-.844 1.641 1.641-.844 2.109c.375.656.656 1.359.844 2.109z"/>
              </svg>
            </button>
            <button 
              class="ai-assistant__header-btn"
              onClick={() => this.clearConversation()}
              title="Clear conversation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"/>
              </svg>
            </button>
            <button 
              class="ai-assistant__header-btn"
              onClick={() => this.setState({ isMinimized: !isMinimized })}
              title={isMinimized ? "Expand" : "Minimize"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d={isMinimized ? "M7 14l5-5 5 5z" : "M7 10l5 5 5-5z"}/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Settings Panel */}
        {showSettings && !isMinimized && (
          <div class="ai-assistant__settings">
            <h4>AI Settings</h4>
            <div class="ai-assistant__setting">
              <label>API Key</label>
              <input 
                type="password"
                class="ai-assistant__input"
                placeholder="Enter your OpenAI API key"
                value={this.props.config.apiKey}
                onInput={(e) => this.updateApiKey((e.target as HTMLInputElement).value)}
              />
              <small>Your API key is stored locally and never sent to our servers</small>
            </div>
            <div class="ai-assistant__setting">
              <label>Model</label>
              <select 
                class="ai-assistant__select"
                value={this.props.config.model}
                onChange={(e) => this.updateModel((e.target as HTMLSelectElement).value)}
              >
                <option value="gpt-4">GPT-4 (Most capable)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
              </select>
            </div>
            <div class="ai-assistant__setting">
              <label>Temperature ({this.props.config.temperature})</label>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={this.props.config.temperature}
                onInput={(e) => this.updateTemperature(parseFloat((e.target as HTMLInputElement).value))}
              />
              <small>Higher values make output more creative, lower values more focused</small>
            </div>
          </div>
        )}
        
        {/* Messages */}
        {!isMinimized && (
          <div class="ai-assistant__messages">
            {!apiKeySet && (
              <div class="ai-assistant__warning">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p>Please add your OpenAI API key in settings to enable AI assistance</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div 
                key={index}
                class={`ai-assistant__message ai-assistant__message--${message.role}`}
              >
                <div class="ai-assistant__message-content">
                  {message.content}
                </div>
                {message.role === 'assistant' && message.applied !== undefined && (
                  <div class="ai-assistant__message-actions">
                    {!message.applied && (
                      <button 
                        class="ai-assistant__apply-btn"
                        onClick={() => this.applySuggestion(index)}
                      >
                        Apply Changes
                      </button>
                    )}
                    {message.applied && (
                      <span class="ai-assistant__applied">✓ Applied</span>
                    )}
                  </div>
                )}
                <div class="ai-assistant__message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div class="ai-assistant__loading">
                <div class="ai-assistant__loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>AI is thinking...</span>
              </div>
            )}
            
            {error && (
              <div class="ai-assistant__error">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <div ref={(el) => this.messagesEndRef = el} />
          </div>
        )}
        
        {/* Suggestions */}
        {suggestions.length > 0 && !isMinimized && (
          <div class="ai-assistant__suggestions">
            <h4>Quick Actions</h4>
            <div class="ai-assistant__suggestions-list">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  class="ai-assistant__suggestion"
                  onClick={() => this.applySuggestionConfig(suggestion)}
                  title={suggestion.description}
                >
                  <span class="ai-assistant__suggestion-title">{suggestion.title}</span>
                  {suggestion.rationale && (
                    <span class="ai-assistant__suggestion-reason">{suggestion.rationale}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input */}
        {!isMinimized && apiKeySet && (
          <div class="ai-assistant__input-area">
            <textarea
              ref={(el) => this.inputRef = el}
              class="ai-assistant__textarea"
              placeholder="Ask me anything about configuring your DataTable..."
              value={input}
              onInput={(e) => this.setState({ input: (e.target as HTMLTextAreaElement).value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  this.sendMessage();
                }
              }}
              disabled={isLoading}
            />
            <button 
              class="ai-assistant__send-btn"
              onClick={() => this.sendMessage()}
              disabled={isLoading || !input.trim()}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        )}
        
        {/* Sample Prompts */}
        {!isMinimized && messages.length === 1 && (
          <div class="ai-assistant__prompts">
            <h4>Try asking:</h4>
            <div class="ai-assistant__prompts-list">
              <button 
                class="ai-assistant__prompt"
                onClick={() => this.setState({ input: 'Make the header background dark blue with white text' })}
              >
                Make the header background dark blue with white text
              </button>
              <button 
                class="ai-assistant__prompt"
                onClick={() => this.setState({ input: 'Add a new column for email addresses with validation' })}
              >
                Add a new column for email addresses with validation
              </button>
              <button 
                class="ai-assistant__prompt"
                onClick={() => this.setState({ input: 'Format all date columns as MM/DD/YYYY' })}
              >
                Format all date columns as MM/DD/YYYY
              </button>
              <button 
                class="ai-assistant__prompt"
                onClick={() => this.setState({ input: 'Make the table responsive with horizontal scrolling' })}
              >
                Make the table responsive with horizontal scrolling
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  /**
   * Send message to AI
   */
  private async sendMessage() {
    const { input } = this.state;
    const { config, context } = this.props;
    
    if (!input.trim() || !config.apiKey) return;
    
    // Add user message
    const userMessage: AIConversationEntry = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    this.setState({
      messages: [...this.state.messages, userMessage],
      input: '',
      isLoading: true,
      error: null
    });
    
    try {
      // Prepare the request
      const request: AIRequest = {
        query: input,
        context: context,
        history: this.state.messages
      };
      
      // Call OpenAI API
      const response = await this.callOpenAI(request);
      
      // Add AI response
      const aiMessage: AIConversationEntry = {
        role: 'assistant',
        content: response.suggestion,
        timestamp: Date.now(),
        applied: false
      };
      
      this.setState({
        messages: [...this.state.messages, aiMessage],
        suggestions: response.alternatives || [],
        isLoading: false
      });
      
      // Store the configuration if provided
      if (response.configuration) {
        (aiMessage as any).configuration = response.configuration;
      }
      
    } catch (error) {
      console.error('AI Assistant error:', error);
      this.setState({
        error: 'Failed to get AI response. Please check your API key and try again.',
        isLoading: false
      });
    }
  }
  
  /**
   * Call OpenAI API
   */
  private async callOpenAI(request: AIRequest): Promise<AIResponse> {
    const { config } = this.props;
    
    // Build the system prompt
    const systemPrompt = `You are an expert assistant for configuring DataTables in the K2 Smartforms Material Design framework. 
    You help users configure their DataTables by understanding their requirements in plain English and generating the appropriate JSON configuration.
    
    Current configuration context:
    ${JSON.stringify(request.context.currentConfiguration, null, 2)}
    
    Available controls that can be bound:
    ${request.context.availableControls.join(', ')}
    
    When providing configuration changes, always:
    1. Explain what changes you're making
    2. Provide the specific JSON configuration updates
    3. Explain why these changes achieve the user's goal
    
    Format your response as:
    - A clear explanation of the changes
    - The JSON configuration to apply (if applicable)
    - Any additional suggestions or alternatives`;
    
    // Build messages for API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...request.history.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user', content: request.query }
    ];
    
    // Make API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse the response to extract configuration
    const configuration = this.extractConfiguration(aiResponse);
    
    return {
      suggestion: aiResponse,
      configuration: configuration,
      confidence: 0.8,
      alternatives: []
    };
  }
  
  /**
   * Extract configuration from AI response
   */
  private extractConfiguration(response: string): any | null {
    // Look for JSON code blocks in the response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (error) {
        console.error('Failed to parse configuration from AI response:', error);
      }
    }
    
    // Try to find any JSON object in the response
    const jsonPattern = /\{[\s\S]*\}/;
    const match = response.match(jsonPattern);
    
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (error) {
        console.error('Failed to parse configuration from AI response:', error);
      }
    }
    
    return null;
  }
  
  /**
   * Apply suggestion from AI
   */
  private applySuggestion(messageIndex: number) {
    const message = this.state.messages[messageIndex];
    const configuration = (message as any).configuration;
    
    if (configuration) {
      // Apply the configuration
      this.props.onSuggestionApply(configuration);
      
      // Update message to show it's applied
      const updatedMessages = [...this.state.messages];
      updatedMessages[messageIndex] = {
        ...message,
        applied: true
      };
      
      this.setState({ messages: updatedMessages });
    }
  }
  
  /**
   * Apply a suggestion configuration
   */
  private applySuggestionConfig(suggestion: AISuggestion) {
    this.props.onSuggestionApply(suggestion.configuration);
    
    // Add to conversation
    const message: AIConversationEntry = {
      role: 'assistant',
      content: `Applied: ${suggestion.title}\n\n${suggestion.description}`,
      timestamp: Date.now(),
      applied: true
    };
    
    this.setState({
      messages: [...this.state.messages, message]
    });
  }
  
  /**
   * Clear conversation
   */
  private clearConversation() {
    this.setState({
      messages: [{
        role: 'assistant',
        content: 'Conversation cleared. How can I help you configure your DataTable?',
        timestamp: Date.now(),
        applied: false
      }],
      suggestions: [],
      error: null
    });
  }
  
  /**
   * Update API key
   */
  private updateApiKey(apiKey: string) {
    this.props.onConfigUpdate({ apiKey });
    this.setState({ apiKeySet: !!apiKey });
  }
  
  /**
   * Update model
   */
  private updateModel(model: string) {
    this.props.onConfigUpdate({ model });
  }
  
  /**
   * Update temperature
   */
  private updateTemperature(temperature: number) {
    this.props.onConfigUpdate({ temperature });
  }
  
  /**
   * Scroll to bottom of messages
   */
  private scrollToBottom() {
    this.messagesEndRef?.scrollIntoView({ behavior: 'smooth' });
  }
}