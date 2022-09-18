import * as _ from "lodash";
import { IPassPack } from "./interfaces";

type Fixer = {
  (passPack: IPassPack, selector: string): void;
};

type ObserverASExtension = {
  targetSelector: string;
  options: MutationObserverInit;
  passPack: IPassPack;
  fixers: Array<Fixer>;
};

function overserverCallback(
  mutations: MutationRecord[],
  observer: MutationObserver
) {
  // console.log(`overserverCallback`);
  let extendedObserver = observer as ObserverExtension;
  observer.disconnect(); //maybe implement disconnect all observers?

  //run all fixers
  extendedObserver.alterpsective.extension.fixers.forEach((f) => {
    f(
      extendedObserver.alterpsective.extension.passPack,
      extendedObserver.alterpsective.extension.targetSelector
    );
  });

  //start observing again
  let newObserver = new ObserverExtension(
    extendedObserver.alterpsective.extension
  );
  newObserver.observe();
}
class ObserverExtension extends MutationObserver {
  static observerExtensionCollection = new Array<{passPack:IPassPack,observer: ObserverExtension}>();
  static counter: number = 1;
  targetElement: Element | null | undefined;
  counterId: number;

  constructor(extension: ObserverASExtension) {
    super(overserverCallback);
    this.alterpsective = {
      extension: extension,
    };

    let as = this.alterpsective.extension;
    this.counterId = ObserverExtension.counter++;
    // console.log(`New Observer ${this.counterId}`);
    let existing = ObserverExtension.observerExtensionCollection.filter(
      (o) =>
      
        o.observer.alterpsective.extension.targetSelector == extension.targetSelector && o.passPack.dataTable?.id == extension.passPack.dataTable?.id
    );
    if(existing.length>0)
    {
      console.log(`${existing.length} already watching`);
    }
    ObserverExtension.observerExtensionCollection.push({passPack: this.alterpsective.extension.passPack,observer: this});
    // console.log(`Adding ${as.targetSelector} to oversevers`);

    this.targetElement =
      this.alterpsective.extension.passPack?.dataTable?.querySelector(
        as.targetSelector
      );
    if (this.targetElement == null) {
      console.error(
        `Cannot watch for changed on ${as.passPack.target.referencedK2Object.containerType} ${as.passPack.target.referencedK2Object.name} target select [${as.targetSelector}] as it is undefined `
      );
      return;
    }
  }

  override observe(): void {
    if (this.targetElement != null) {
      super.observe(this.targetElement, this.alterpsective.extension.options);
    }
  }

  override disconnect(): void {
    _.remove(
      ObserverExtension.observerExtensionCollection,
      (o) =>
        o.observer.alterpsective.extension.targetSelector ==
        this.alterpsective.extension.targetSelector && o.passPack.dataTable?.id == this.alterpsective.extension.passPack.dataTable?.id
    );
    // console.log(
    //   `Removing ${this.alterpsective.extension.targetSelector} from oversevers`
    // );
    super.disconnect();
  }

  alterpsective: {
    extension: ObserverASExtension;
  };
  enabled: boolean = true;
}

function fixAndObserveContinues(
  passPack: IPassPack,
  selector: string,
  fixers: Array<Fixer>
) {
  //run fixers
  fixers.forEach((f) => {
    f(passPack, selector);
  });

  const config = { attributes: false, childList: true, subtree: true };
  const observer = new ObserverExtension({
    targetSelector: selector,
    passPack: passPack,
    fixers: fixers,
    options: { attributes: true, childList: true, subtree: true },
  });

  observer.observe();
}

let applySortAndFilterToNewLine: Fixer = (
  passPack: IPassPack,
  selector: string
) => {


//#region applySortAndFilterToNewLine

//Note:Commented out as to complex and better set using CSS rules 
  // if(passPack.processedSettings.applySortAndFilterToNewLine==false) return;

  // passPack.dataTable?.querySelectorAll(".tui-grid-cell-header")
  //   .forEach((ele) => {
  //     let exitingDiv: HTMLDivElement | undefined;
  //     if (
  //       ele.getElementsByTagName("div").length > 0 &&
  //       ele.childNodes.length > 1
  //     ) {
  //       exitingDiv = ele.getElementsByTagName("div")[0];
  //     }

  //     let aTags = ele.querySelectorAll(":scope > a")

  //     if (!exitingDiv) {
  //       exitingDiv = document.createElement("div");
  //       exitingDiv.classList.add("as-newline");
  //     }

  //     //If the div doesnt have kids we need to add then, but if it does and so does the parent then we need to remove the ones from the partent.
  //     if (exitingDiv.children.length == 0) {
  //       aTags.forEach((aTag) => {
  //         if (exitingDiv) exitingDiv.appendChild(aTag);
  //       });
  //     }
  //     else
  //     {
  //       aTags.forEach(aTag=>
  //         {
  //           aTag.remove()
  //         })
  //     }

  //     ele.appendChild(exitingDiv);
  //   });
    //#endregion
};

let adjustHeaderHeight: Fixer = (passPack: IPassPack, selector: string) => {
  if (
    !passPack.processedSettings.optGrid?.header?.height
  ) {
    if(!passPack.dataTable) return
    let tuiGridHeaderArea = passPack.dataTable.querySelectorAll(
      ".tui-grid-header-area"
    );

    tuiGridHeaderArea.forEach((n) => {
      (n as HTMLElement).style.height = "max-content";
    });
    // console.log("fixing table height", tuiGridHeaderArea);
  }
};

export function watchAndApplyStyle(passPack: IPassPack) {
  //Header Styling Watch
  //let headerElementToWatch = passPack.dataTable.querySelectorAll(".tui-grid-header-area")
  fixAndObserveContinues(passPack, ".tui-grid-header-area", [
    adjustHeaderHeight,
    applySortAndFilterToNewLine,
  ]);
}
