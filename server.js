const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const angularProject = require('./angular.json');
const defaultProject = angularProject.defaultProject;
const appPath = path.join(
    __dirname,
    // tslint:disable-next-line: trailing-comma
    `${angularProject.projects[defaultProject].architect.build.options.outputPath}`
);

app.use(express.static(appPath, { extensions: ['html', 'js'] }));

const args = getArgs();
app.get('/*', (_, res) => {
    return res.sendFile(`${appPath}/index.html`);
});

function getArgs() {
    // tslint:disable-next-line: variable-name
    const _args = process.argv.slice(2);
    const obj = {};
    _args.forEach((arg) => {
        // tslint:disable-next-line: variable-name
        const _obj = arg.split('=');
        obj[_obj[0].replace('--', '')] = JSON.parse(_obj[1] || '');
    });

    return obj;
}

if (args.port) {
    http.createServer(app)
        .listen(args.port, () => {
            // tslint:disable-next-line: no-console
            console.log(`[Server] server started on port ${args.port}`);
        });
} else {
    // tslint:disable-next-line: no-console
    console.error(`[Server] error: port is not specified`);
}
