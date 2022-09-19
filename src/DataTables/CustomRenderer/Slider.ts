// import { Log } from "../../Common/Logging";
import {
  CustomSliderDataGridRenderOptions,
  IPassPack,
} from "../Extension/interfaces";

import { updateAllK2ControlsWithDataForTheRowKey } from "../Extension";
import { Slider } from "@alterspective-io/as-framework-material-design/dist/components";

export class CustomSliderRenderer {
  el: Slider;
  con: HTMLDivElement;
  constructor(props: any) {
    let options: CustomSliderDataGridRenderOptions =
      props.columnInfo.renderer.options;
    this.con = document.createElement("div") as HTMLDivElement;
    //this.con.style.padding = "5px";
    this.con.style.display = "flex";
    this.con.style.justifyContent = "center";
    this.con.style.alignContent = "center";
    this.con.style.width = "100%";

    this.el = new Slider(); // document.createElement("mwc-slider");
    // let x = SliderBase;
    // x = x;

    this.el.withTickMarks = true;
    //Object.assign(this.el, options)
    this.el.style.width = "100%";
    this.el.min = options.min || 0;
    this.el.max = options.max || 100;
    this.el.disabled = options.disabled || false;
    this.el.step = options.step || 1;
    this.el.discrete = options.discrete || false;
    this.el.withTickMarks = options.withTickMarks || false;

    // if(options.list)
    // {
    //   let optionsList = document.createElement("datalist");
    //   optionsList.id = options.passPack.dataTable.id + "_datalist"

    //   for (let index = 0; index < options.list.length; index++) {
    //     const option = options.list[index];

    //     let newOption = document.createElement("option")
    //     newOption.value = option.value;
    //     if(option.label) newOption.label = option.label

    //     optionsList.append(newOption)

    //   }
    //   this.con.appendChild(optionsList)
    //   this.el.setAttribute("list",optionsList.id);

    // }

    this.el.addEventListener("change", (ev) => {
      props.grid.setValue(props.rowKey, props.columnInfo.name, this.el.value);
      updateAllK2ControlsWithDataForTheRowKey(
        options.passPack,
        props.rowKey
      );
    });

    this.el.addEventListener("mousedown", (ev) => {
      ev.stopPropagation();
    });

    this.el.addEventListener("mousemove", (ev: MouseEvent) => {
      props.grid.setValue(props.rowKey, props.columnInfo.name, this.el.value);
      updateAllK2ControlsWithDataForTheRowKey(
        options.passPack,
        props.rowKey
      );
      ev.stopPropagation();
    });

    this.con.appendChild(this.el);

    this.render(props);
  }

  getValue() {
    return this.el.value;
  }

  getElement() {
    return this.con;
  }

  render(props: any) {
    this.el.value = Number.parseFloat(props.value || 0);
  }
}
