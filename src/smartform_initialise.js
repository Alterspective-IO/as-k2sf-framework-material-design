(async () => {
  await import("https://asscripts.blob.core.windows.net/scripts/dev/main.alterspective.materialdesignforK2.js").then(() => {
    main_alterspective_materialdesignforK2.initialize().then(() => {
      console.log("Material Design for K2 Loaded..");
      as.getControlsByName("frameWorkStatus")[0].value="Loaded"
    });
  });
})();
