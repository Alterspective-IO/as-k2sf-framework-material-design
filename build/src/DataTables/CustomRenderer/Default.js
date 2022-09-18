export class OverriddenDefaultRenderer {
    constructor(props) {
        const el = document.createElement('div');
        const { ellipsis, whiteSpace, renderer } = props.columnInfo;
        this.props = props;
        this.el = el;
        this.renderer = renderer;
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
    setStylesAndAttributes() {
        let className = "";
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
    setAttrsOrStyles(type, targets) {
        Object.keys(targets).forEach((name) => {
            const value = this.isFunction(targets[name]) ? targets[name](this.props) : targets[name];
            if (type === 'attrs') {
                this.el.setAttribute(name, value);
            }
            else {
                this.el.style[name] = value;
            }
        });
    }
    getElement() {
        return this.el;
    }
    isFunction(something) {
        if (typeof something == "function")
            return true;
        return false;
    }
    render(props) {
        this.setStylesAndAttributes();
        this.el.innerHTML = `${props.formattedValue}`;
    }
}
//# sourceMappingURL=Default.js.map