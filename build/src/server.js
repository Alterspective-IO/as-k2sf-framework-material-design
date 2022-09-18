import path from "path";
const express = require('express');
const app = express();
const port = 3000;
// app.get('/', (req, res) => {
// })
app.use(`/`, express.static(path.resolve('.')));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=server.js.map