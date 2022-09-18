
export class CustomColumnHeader {
    el : HTMLDivElement 

    constructor(props:any) {
      const columnInfo = props.columnInfo;
      const el = document.createElement('div');
      el.className = 'tui-grid-cell tui-grid-cell-header mdc-data-table__header-cell';
      el.textContent = columnInfo.header
      
      this.el = el;
    }
  
    getElement() {
      return this.el;
    }
  
    render(props:any) {
       this.el.textContent = props.columnInfo.header;
    }
  }