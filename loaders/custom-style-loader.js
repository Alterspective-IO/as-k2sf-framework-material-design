const path = require("path");

module.exports = function (source) {

    console.log("-----------------custom-style-loader.js-----------------");
   

    const fileName = path.basename(this.resourcePath, path.extname(this.resourcePath));
    const id = `custom-style-${fileName}`; // Unique ID based on file name

    console.log("fileName: ", fileName);
    console.log("id: ", id);

    console.log("-----------------custom-style-loader.js-----------------");

    return `
        const style = document.createElement('style');
        style.id = '${id}';
        style.innerHTML = ${JSON.stringify(source)};
        document.head.appendChild(style);
    `;
};


// insert: function insertIntoTarget(element, options) {
            //                     var parent = options.target || document.head;
            //                     var id = options.id || "as-not-set"
            //                     element.id = id //important for webcomponents styling 
            //                     parent.appendChild(element);
            //                 },