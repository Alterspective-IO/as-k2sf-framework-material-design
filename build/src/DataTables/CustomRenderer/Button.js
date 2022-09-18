import { updateAllK2ControlsWithDataForTheRowKey } from "../Extension";
// import { Log } from "../../Common/Logging";
export class CustomButtonRenderer {
    constructor(props) {
        let options = props.columnInfo.renderer.options;
        this.con = document.createElement("div");
        this.con.style.padding = "5px";
        this.con.style.display = "flex";
        this.con.style.justifyContent = "center";
        this.con.style.alignContent = "center";
        this.el = document.createElement("mwc-button");
        let grid = props.grid;
        this.el.rowData = grid.getData()[props.rowKey];
        let passPack = options.passPack;
        let as = options.as;
        // const { min, max } = props.columnInfo.renderer.options;
        // this.el.style.width = (this.el,props.columnInfo.renderer.options.width as string) || "50px"
        // this.el.style.height = (this.el,props.columnInfo.renderer.options.height as string) || "36px"
        Object.assign(this.el, options);
        this.el.addEventListener("click", (ev) => {
            console.log(ev);
            console.log(props);
            console.log(this.el);
            if (options.k2rule_to_execute_on_button_click) {
                as.getRulesByConfigurationName(options.k2rule_to_execute_on_button_click, options.passPack.viewInstance).forEach((r) => {
                    r.execute();
                });
            }
            //Update the row col value to indicate a clicked
            let newValue = "1";
            let columnToUpdate = props.columnInfo.name;
            if (options.targetColumn)
                columnToUpdate = options.targetColumn;
            if (options.toggleValueOnClick)
                if (options.toggleValueOnClick == true) {
                    let currentValue = props.grid.getValue(props.rowKey, columnToUpdate);
                    if (currentValue)
                        if (currentValue == "1")
                            newValue = "0";
                }
            grid.setValue(props.rowKey, columnToUpdate, newValue);
            //let passPack = grid.passPack!;
            updateAllK2ControlsWithDataForTheRowKey(passPack, props.rowKey);
            ev.stopPropagation();
        });
        this.con.appendChild(this.el);
        // this.el = con;
        this.render(props);
    }
    getElement() {
        return this.con;
    }
    render(props) {
        // this.el.textContent = props.value || "Button";
        // this.el.label = props.
    }
}
//# sourceMappingURL=Button.js.map