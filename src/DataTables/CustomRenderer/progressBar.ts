// import { Log } from "../../Common/Logging";
import {
  IPassPack,
  CustomProcessBarDataGridRenderOptions,
} from "../Extension/interfaces";
import { updateAllK2ControlsWithDataForTheRowKey } from "../Extension";

export class AsProgress extends HTMLElement {
  
  constructor() {
    // Always call super first in constructor
    super();
    const style = document.createElement("style");
    console.log(style.isConnected);

    style.textContent = `
  progress {
    -webkit-appearance: none;
    appearance: none;
    position: relative;
    width: 100%;
    height: 15px;
    font-size: 10px;
  }

  progress::-webkit-progress-value {
    background-color: ${this.color};
    transition: filter 300ms, width 300ms;
  }

  progress::-webkit-progress-bar {
    background-color: ${this.backgroundColor};
    border-radius: 10px;
    overflow: hidden;
  }

  /* progress::before {
    content: "%";
    position: absolute;
    left: 0;
    top: 20px;
    opacity: 0.4;
  } */

  progress::after {
    content: attr(value) "%";
    position: relative;
    left: 50%;
    opacity: 0.7;
  }
`;

    let progressElement = document.createElement("div");
    progressElement.classList.add("progress-element");
    progressElement.part.add("progress-element");
    let progressLabel = document.createElement("div");
    progressLabel.classList.add("progress-label");
    progressLabel.part.add("progress-label");
    this.progressContainer = document.createElement("div");
    this.progressContainer.classList.add("progress-container");
    this.progressContainer.part.add("progress-container");
    this.progress = document.createElement("progress");
    this.progress.part.add("progress");

    progressElement.appendChild(progressLabel);
    progressElement.appendChild(this.progressContainer);
    this.progressContainer.appendChild(this.progress);

    // this.el = document.createElement("progress")
    this.root = this.attachShadow({ mode: "open" });
    // this.el.title = "%"

    // this.el.classList.add("as-progress")
    // this.el.part.add("as-progress")
    // constructor definition left out for brevity
    // …
    this.root.appendChild(progressElement);
    this.root.appendChild(style);
  }

  progressContainer: HTMLDivElement;
  progress: HTMLProgressElement;

  root: ShadowRoot;
  _value: number = 0;
  _max: number = 100;

  
  private _color : string = "#0093b2";
  public get color() : string {
    return this._color;
  }
  public set color(v : string) {
    this._color = v;
  }
  
  
  private _backgroundColor : string = "#231f20";
  public get backgroundColor() : string {
    return this._backgroundColor;
  }
  public set backgroundColor(v : string) {
    this._backgroundColor = v;
  }
  
  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this._value = v;
  }

  get max(): number {
    return this._max;
  }

  set max(v: number) {
    this._max = v;
  }

  connectedCallback() {
    (this.progressContainer as any).value = this.value;
    this.progress.value = this.value;
    this.progress.max = this.max;
  }
}

// Define the new element
customElements.define("as-progress", AsProgress);

export class CustomProcessBarRenderer {
  el: AsProgress;
  con: HTMLDivElement;
  constructor(props: any) {
    let options: CustomProcessBarDataGridRenderOptions =
      props.columnInfo.renderer.options;
    this.con = document.createElement("div") as HTMLDivElement;
    // const shadowOpen = this.con.attachShadow({mode: 'open'});
    //this.con.style.padding = "5px";

    this.con.style.width = "100%";
    this.el = document.createElement("as-progress") as AsProgress;
    this.el.classList.add("as-progress");

    //Object.assign(this.el, options)
    this.el.style.width = "100%";
    this.el.max = options.max || 100;
    this.con.style.backgroundColor = options.backgroundColor;

    // this.el.addEventListener("change", (ev) => {
    //   props.grid.setValue(props.rowKey, props.columnInfo.name, this.el.value);
    //   updateAllK2ControlsWithDataForTheRowKey(
    //     options.passPack,
    //     props.rowKey
    //   );
    // });

    this.el.addEventListener("mousedown", (ev) => {
      ev.stopPropagation();
    
    });

    // this.el.addEventListener("mousemove", (ev: MouseEvent) => {
    //   props.grid.setValue(props.rowKey, props.columnInfo.name, this.el.value);
    //   updateAllK2ControlsWithDataForTheRowKey(
    //     options.passPack,
    //     props.rowKey
    //   );
    //   ev.stopPropagation();
    // });

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
