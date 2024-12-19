// import { CellRendererOptions, CellRendererProps } from "@alterspective-io/as-framework-material-design/dist/types";

import { CellRendererProps } from "@alterspective-io/as-framework-material-design/supporting";

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 0 : 1) extends <T>() => T extends Y
  ? 0
  : 1
  ? A
  : B;
type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>;
}[keyof T];
type StyleProps = Exclude<WritableKeys<CSSStyleDeclaration>, number | Function>;
type TargetType = 'attrs' | 'styles';

export class OverriddenDefaultRenderer  {
  private el: HTMLDivElement;

  private props: CellRendererProps;
  private renderer : any | undefined;

  public constructor(props: CellRendererProps) {
    const el = document.createElement('div');
    const { ellipsis, whiteSpace, renderer } = props.columnInfo;
    

    this.props = props;
    this.el = el;
    this.renderer = renderer

    this.setStylesAndAttributes();

    // @TODO: we should remove below options and consider common the renderer option for style, attribute and class names
    if (ellipsis) {
      el.style.textOverflow = 'ellipsis';
    }
    if (whiteSpace) {
      el.style.whiteSpace = whiteSpace;
    }

    this.render(props);
  }

    private setStylesAndAttributes() {
        let className : string = ""
        if (this.renderer) {
            const { attributes, styles, classNames } = this.renderer;

            if (attributes) {
                this.setAttrsOrStyles('attrs', attributes);
            }
            if (styles) {
                this.setAttrsOrStyles('styles', styles);
            }
            if (classNames) {
                className = ` ${classNames.join(' ')}`;
            }
        }

        this.el.className = "tui-grid-cell-content" + className;   
    }

  private setAttrsOrStyles(type: TargetType, targets: Record<string, any>) {
    Object.keys(targets).forEach((name) => {
      const value = this.isFunction(targets[name]) ? targets[name](this.props) : targets[name];
      if (type === 'attrs') {
        this.el.setAttribute(name, value);
      } else {
        this.el.style[name as StyleProps] = value;
      }
    });
  }

  public getElement() {
  
   
    return this.el;
  }

  isFunction(something:any) : boolean
  {
    if(typeof something =="function") return true
    return false
  }

  public render(props: CellRendererProps) {
    this.setStylesAndAttributes();
    this.el.innerHTML = `${props.formattedValue}`;
  }

}
