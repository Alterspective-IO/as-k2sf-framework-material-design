/**
 * JSONEditor Component
 * JSON configuration editor with syntax highlighting
 */

import { h, Component } from 'preact';

interface JSONEditorProps {
  configuration: any;
  onChange: (config: any) => void;
  readOnly: boolean;
}

interface JSONEditorState {
  jsonText: string;
  error: string | null;
  isValid: boolean;
}

export class JSONEditor extends Component<JSONEditorProps, JSONEditorState> {
  constructor(props: JSONEditorProps) {
    super(props);
    
    this.state = {
      jsonText: JSON.stringify(props.configuration, null, 2),
      error: null,
      isValid: true
    };
  }
  
  componentDidUpdate(prevProps: JSONEditorProps) {
    if (prevProps.configuration !== this.props.configuration) {
      this.setState({
        jsonText: JSON.stringify(this.props.configuration, null, 2),
        error: null,
        isValid: true
      });
    }
  }
  
  render() {
    const { readOnly } = this.props;
    const { jsonText, error, isValid } = this.state;
    
    return (
      <div class="json-editor">
        <div class="json-editor__toolbar">
          <button onClick={() => this.formatJSON()}>Format</button>
          <button onClick={() => this.validateJSON()}>Validate</button>
          <button onClick={() => this.copyToClipboard()}>Copy</button>
          {!readOnly && (
            <button 
              onClick={() => this.applyChanges()}
              disabled={!isValid}
            >
              Apply Changes
            </button>
          )}
        </div>
        
        {error && (
          <div class="json-editor__error">
            {error}
          </div>
        )}
        
        <textarea
          class={`json-editor__textarea ${!isValid ? 'json-editor__textarea--error' : ''}`}
          value={jsonText}
          onInput={(e) => this.handleInput((e.target as HTMLTextAreaElement).value)}
          readOnly={readOnly}
          spellcheck={false}
        />
      </div>
    );
  }
  
  private handleInput(value: string) {
    this.setState({ jsonText: value });
    this.validateJSON();
  }
  
  private validateJSON() {
    try {
      JSON.parse(this.state.jsonText);
      this.setState({ error: null, isValid: true });
      return true;
    } catch (e) {
      this.setState({ 
        error: `Invalid JSON: ${(e as Error).message}`,
        isValid: false 
      });
      return false;
    }
  }
  
  private formatJSON() {
    if (this.validateJSON()) {
      const parsed = JSON.parse(this.state.jsonText);
      this.setState({
        jsonText: JSON.stringify(parsed, null, 2)
      });
    }
  }
  
  private applyChanges() {
    if (this.validateJSON()) {
      const config = JSON.parse(this.state.jsonText);
      this.props.onChange(config);
    }
  }
  
  private copyToClipboard() {
    navigator.clipboard.writeText(this.state.jsonText);
  }
}