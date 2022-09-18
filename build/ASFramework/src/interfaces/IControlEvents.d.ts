import { IControlEvent } from "./IControlEvent";
export interface IControlEvents {
    smartformEventChanged: IControlEvent;
    smartformEventPopulated: IControlEvent;
    smartformEventClicked: IControlEvent;
    smartFormEventClick: IControlEvent;
    elementClick: IControlEvent;
    elementMouseMove: IControlEvent;
    elementMouseEnter: IControlEvent;
    elementMouseLeave: IControlEvent;
    elementHover: IControlEvent;
    elementLostFocus: IControlEvent;
    elementKeypress: IControlEvent;
}
