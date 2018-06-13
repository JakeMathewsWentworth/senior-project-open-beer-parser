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
var beers = firestore.collection('beers');
var brewerys = firestore.collection('brewers');

var beerCount = 0;
var invalidBeerCount = 0;
var breweryCount = 0;
var invalidBreweryCount = 0;
for (beerIndex in beerdb) {
    var beer = beerdb[beerIndex].fields;
    var finalBeer = {
        name: beer.name ? beer.name : unkownValue,
        category: beer.cat_name ? beer.cat_name : unkownValue,
        style: beer.style_name ? beer.style_name : unkownValue,
        description: beer.descript ? beer.descript : unkownValue,
        abv: beer.abv ? beer.abv : unkownValue,
        ibu: beer.ibu ? beer.ibu : unkownValue,
        upc: beer.upc ? beer.upc : unkownValue,
        brewery_id: beer.brewery_id ? beer.brewery_id : unkownValue
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

    if (isNaN(beer.id)) {
        console.log("Invalid beer ID", beer.id);
        invalidBeerCount++;
    } else {
        beers.doc(beer.id).set(beer);
        beerCount++;
    }

    if (isNaN(beer.brewery_id)) {
        console.log("Invalid brewery ID", beer.brewery_id);
        invalidBreweryCount++;
    } else {
        brewerys.doc(beer.brewery_id).set(finalBrewery);
        breweryCount++;
    }
}
console.log('Done... Summary Below');
console.log('Beer Count', beerCount);
console.log('Brewery Count', breweryCount);
console.log('Invalid Beer Count', invalidBeerCount);
console.log('Invalid Brewery Count', invalidBreweryCount);
