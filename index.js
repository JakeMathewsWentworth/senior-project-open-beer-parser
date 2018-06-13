var Firestore = require('@google-cloud/firestore');
var parseArgs = require('minimist');

var args = parseArgs(process.argv.slice(2), {
    string: 'serviceJson',
    string: 'database'
});

var firestore = new Firestore({
    projectId: args.database,
    keyFilename: args.serviceJson,
});

var document = firestore.doc('beers/4078');

console.log(document.id);

document.get().then(doc => {
    console.log(doc.data());
});
