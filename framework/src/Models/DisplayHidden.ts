export function displayFormIfHidden() {
    
    // let styleControl = window.as.getControlsByName(
    //   "Private - Style Display None"
    // )[0];
  
    // if (!styleControl) return;
  

    let runtimeContent = document.querySelector(".runtime-content") as HTMLDivElement

    // let styleValue = styleControl.value
    // $(".runtime-content").fadeOut(2);

    $(".runtime-content").fadeIn(1000); 
  
    if(runtimeContent)
    {
        runtimeContent.style.display = ""
    }

    if(window.as?.getControlsByName)
    {
        window.as.getControlsByName(
        "Private - Style Display None"
        ).forEach(c=>c.value="")
    }
  
  
  }