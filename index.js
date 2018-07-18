var Firestore = require('@google-cloud/firestore');
var parseArgs = require('minimist');

var args = parseArgs(process.argv.slice(2), {
    string: 'serviceJson',
    string: 'database',
    string: 'beerdb'
});

var firestore = new Firestore({
    projectId: args.database,
    keyFilename: args.serviceJson,
});

var unkownValue = '';

var beerdb = require(args.beerdb);
var categories = firestore.collection('categories');
var styles = firestore.collection('styles');
var beers = firestore.collection('beers');
var brewerys = firestore.collection('brewers');

var invalid = {
    beer: 0,
    brewery: 0,
    style: 0,
    category: 0
}
var valid = {
    beer: 0,
    brewery: 0,
    style: 0,
    category: 0
}

for (beerIndex in beerdb) {
    var beer = beerdb[beerIndex].fields;

    var categoryId = beer.cat_id ? beer.cat_id : unkownValue;
    var category = {
        name: beer.cat_name ? beer.cat_name : unkownValue,
    }

    var styleId = beer.style_id ? beer.style_id : unkownValue;
    var style = {
        name: beer.style_name ? beer.style_name : unkownValue,
    }

    var finalBeer = {
        name: beer.name ? beer.name : unkownValue,
        categoryId: categoryId,
        styleId: styleId,
        description: beer.descript ? beer.descript : unkownValue,
        abv: beer.abv ? beer.abv : unkownValue,
        ibu: beer.ibu ? beer.ibu : unkownValue,
        upc: beer.upc ? beer.upc : unkownValue,
        breweryId: beer.brewery_id ? beer.brewery_id : unkownValue
    }

    var finalBrewery = {
        name: beer.name_breweries ? beer.name_breweries : unkownValue,
        country: beer.country ? beer.country : unkownValue,
        state: beer.state ? beer.state : unkownValue,
        city: beer.city ? beer.city : unkownValue,
        address1: beer.address1 ? beer.address1 : unkownValue,
        address2: beer.address2 ? beer.address2 : unkownValue,
        coordinates: beer.coordinates ? beer.coordinates : unkownValue,
        website: beer.website ? beer.website : unkownValue,
    }

    if (isNaN(categoryId) || !categoryId) {
        console.log("Invalid category ID", categoryId);
        invalid.category += 1;
    } else {
        categories.doc(categoryId).set(category);
        valid.category += 1;
    }

    if (isNaN(styleId) || !styleId) {
        console.log("Invalid style ID", styleId);
        invalid.style += 1;
    } else {
        styles.doc(styleId).set(style);
        valid.style += 1;
    }

    if (isNaN(beer.id)) {
        console.log("Invalid beer ID", beer.id);
        invalid.beer += 1;
    } else {
        beers.doc(beer.id).set(finalBeer);
        valid.beer += 1;
    }

    if (isNaN(beer.brewery_id)) {
        console.log("Invalid brewery ID", beer.brewery_id);
        invalid.brewery += 1;
    } else {
        brewerys.doc(beer.brewery_id).set(finalBrewery);
        valid.brewery += 1;
    }
}
console.log('Done... Summary Below');
console.log(valid);
console.log(invalid);
console.log('Beer Count', valid.beer);
console.log('Brewery Count', valid.brewery);
console.log('Invalid Beer Count', invalid.beer);
console.log('Invalid Brewery Count', invalid.brewery);
console.log('Uploading Data Now...')