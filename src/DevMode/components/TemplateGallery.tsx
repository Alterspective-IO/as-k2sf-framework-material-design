/**
 * TemplateGallery Component
 * Gallery of pre-built configuration templates
 */

import { h, Component } from 'preact';
import { ConfigurationTemplate } from '../types';

interface TemplateGalleryProps {
  onTemplateSelect: (template: ConfigurationTemplate) => void;
  currentConfiguration: any;
}

export class TemplateGallery extends Component<TemplateGalleryProps> {
  private templates: ConfigurationTemplate[] = [
    {
      id: 'basic-table',
      name: 'Basic Table',
      description: 'Simple table with sortable columns',
      category: 'basic',
      tags: ['simple', 'starter'],
      version: '1.0.0',
      compatibility: ['1.0.0'],
      customizable: [],
      configuration: {
        optGrid: {
          columns: [
            { name: 'id', header: 'ID', sortable: true },
            { name: 'name', header: 'Name', sortable: true },
            { name: 'email', header: 'Email', sortable: true }
          ]
        }
      }
    },
    {
      id: 'editable-grid',
      name: 'Editable Grid',
      description: 'Grid with inline editing capabilities',
      category: 'advanced',
      tags: ['editable', 'form'],
      version: '1.0.0',
      compatibility: ['1.0.0'],
      customizable: [],
      configuration: {
        optGrid: {
          columns: [
            { name: 'id', header: 'ID', editor: null },
            { name: 'name', header: 'Name', editor: 'text' },
            { name: 'status', header: 'Status', editor: { type: 'select', options: { listItems: [] } } }
          ]
        }
      }
    }
  ];
  
  render() {
    return (
      <div class="template-gallery">
        <div class="template-gallery__header">
          <input 
            type="text" 
            class="template-gallery__search"
            placeholder="Search templates..."
          />
        </div>
        
        <div class="template-gallery__grid">
          {this.templates.map(template => (
            <div 
              key={template.id}
              class="template-card"
              onClick={() => this.props.onTemplateSelect(template)}
            >
              <div class="template-card__header">
                <h4>{template.name}</h4>
                <span class="template-card__category">{template.category}</span>
              </div>
              <p class="template-card__description">{template.description}</p>
              <div class="template-card__tags">
                {template.tags.map(tag => (
                  <span key={tag} class="template-card__tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}