const app = require("./index");

app.listen(process.env.PORT || 3333, process.env.HOST);
console.log(`Server runing on port ${process.env.PORT}`);
