// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

// get the Cat model
const Cat = models.Cat.CatModel;

/// / get the Dog Model
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

const defaultDogData = {
  name: 'unknown',
  breed: 'unknown breed',
  age: 0,
};

// object for us to keep track of the last Cat we made and dynamically update it sometimes
let lastAdded = new Cat(defaultData);

let lastAddedDog = new Dog(defaultDogData);

const hostIndex = (req, res) => {
  // res.render takes a name of a page to render.
  // These must be in the folder you specified as views in your main app.js file
  // Additionally, you don't need .jade because you registered the
  // file type in the app.js as jade. Calling res.render('index')
  // actually calls index.jade. A second parameter of JSON can be passed
  // into the jade to be used as variables with #{varName}
  res.render('index', {
    currentName: lastAdded.name,
    currentDogName: lastAddedDog.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllCats = (req, res, callback) => {
  // Call the model's built in find function and provide it a
  // callback to run when the query is complete
  // Find has several versions
  // one parameter is just the callback
  // two parameters is JSON of search criteria and callback.
  // That limits your search to only things that match the criteria
  // The find function returns an array of matching objects
  // The lean function will force find to return data in the js
  // object format, rather than the Mongo document format.
  Cat.find(callback).lean();
};

const readAllDogs = (req, res, callback) => {
  // Call the model's built in find function and provide it a
  // callback to run when the query is complete
  // Find has several versions
  // one parameter is just the callback
  // two parameters is JSON of search criteria and callback.
  // That limits your search to only things that match the criteria
  // The find function returns an array of matching objects
  // The lean function will force find to return data in the js
  // object format, rather than the Mongo document format.
  Dog.find(callback).lean();
};

const readCat = (req, res) => {
  const name1 = req.query.name;

  // function to call when we get objects back from the database.
  // With Mongoose's find functions, you will get an err and doc(s) back
  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };

  // Call the static function attached to CatModels.
  // This was defined in the Schema in the Model file.
  // This is a custom static function added to the CatModel
  // Behind the scenes this runs the findOne method.
  // You can find the findByName function in the model file.
  Cat.findByName(name1, callback);
};

const readDog = (req, res) => {
  const name1 = req.query.name;

  // function to call when we get objects back from the database.
  // With Mongoose's find functions, you will get an err and doc(s) back
  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };

  // Call the static function attached to CatModels.
  // This was defined in the Schema in the Model file.
  // This is a custom static function added to the CatModel
  // Behind the scenes this runs the findOne method.
  // You can find the findByName function in the model file.
  Dog.findByName(name1, callback);
};

const hostPage1 = (req, res) => {
  // function to call when we get objects back from the database.
  // With Mongoose's find functions, you will get an err and doc(s) back
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // return success
    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  // res.render takes a name of a page to render.
  // These must be in the folder you specified as views in your main app.js file
  // Additionally, you don't need .jade because you registered
  // the file type in the app.js as jade. Calling res.render('index')
  // actually calls index.jade. A second parameter of JSON can be
  // passed into the jade to be used as variables with #{varName}
  res.render('page2');
};

const hostPage3 = (req, res) => {
  // res.render takes a name of a page to render.
  // These must be in the folder you specified as views in your main app.js file
  // Additionally, you don't need .jade because you registered the file type
  // in the app.js as jade. Calling res.render('index')
  // actually calls index.jade. A second parameter of JSON can be passed
  // into the jade to be used as variables with #{varName}
  res.render('page3');
};

const hostPage4 = (req, res) => {
  // function to call when we get objects back from the database.
  // With Mongoose's find functions, you will get an err and doc(s) back
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // return success
    return res.render('page4', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

const getName = (req, res) => {
  // res.json returns json to the page.
  // Since this sends back the data through HTTP
  // you can't send any more data to this user until the next response
  res.json({ name: lastAdded.name });
};

const getDogName = (req, res) => {
  // res.json returns json to the page.
  // Since this sends back the data through HTTP
  // you can't send any more data to this user until the next response
  res.json({ name: lastAddedDog.name });
};

const setName = (req, res) => {
  // check if the required fields exist
  // normally you would also perform validation
  // to know if the data they sent you was real
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    // if not respond with a 400 error
    // (either through json or a web page depending on the client dev)
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  // if required fields are good, then set name
  const name = `${req.body.firstname} ${req.body.lastname}`;

  // dummy JSON to insert into database
  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  // create a new object of CatModel with the object to save
  const newCat = new Cat(catData);

  // create new save promise for the database
  const savePromise = newCat.save();

  savePromise.then(() => {
    // set the lastAdded cat to our newest cat object.
    // This way we can update it dynamically
    lastAdded = newCat;
    // return success
    res.json({ name: lastAdded.name, beds: lastAdded.bedsOwned });
  });

  // if error, return it
  savePromise.catch((err) => res.status(500).json({ err }));

  return res;
};

const setDogName = (req, res) => {
  // check if the required fields exist
  // normally you would also perform validation
  // to know if the data they sent you was real
  if (!req.body.name || !req.body.age || !req.body.breed) {
    // if not respond with a 400 error
    // (either through json or a web page depending on the client dev)
    return res.status(400).json({ error: 'name, age, and breed are required' });
  }

  // if required fields are good, then set name
  const name = `${req.body.name} `;

  // dummy JSON to insert into database
  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  // create new save promise for the database
  const savePromise = newDog.save();

  savePromise.then(() => {
    // This way we can update it dynamically
    lastAddedDog = newDog;
    // return success
    res.json({ name: lastAddedDog.name, breed: lastAddedDog.breed, age: lastAddedDog.age });
  });

  // if error, return it
  savePromise.catch((err) => res.status(500).json({ err }));

  return res;
};

const searchName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  return Cat.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // if no matches, let them know
    // (does not necessarily have to be an error since technically it worked correctly)
    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    // if a match, send the match back
    return res.json({ name: doc.name, beds: doc.bedsOwned });
  });
};

const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  return Dog.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // if no matches, let them know
    // (does not necessarily have to be an error since technically it worked correctly)
    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }

    // if a match, send the match back
    return res.json({ name: doc.name, breed: doc.breed, age: doc.age });
  });
};

const updateLast = (req, res) => {
  // Your model is JSON, so just change a value in it.
  // This is the benefit of ORM (mongoose) and/or object documents (Mongo NoSQL)
  // You can treat objects just like that - objects.
  // Normally you'd find a specific object, but we will only
  // give the user the ability to update our last object
  lastAdded.bedsOwned++;

  // once you change all the object properties you want,
  // then just call the Model object's save function
  // create a new save promise for the database
  const savePromise = lastAdded.save();

  // send back the name as a success for now
  savePromise.then(() => res.json({ name: lastAdded.name, beds: lastAdded.bedsOwned }));

  // if save error, just return an error for now
  savePromise.catch((err) => res.status(500).json({ err }));
};

const updateLastDog = (req, res) => {
  // Your model is JSON, so just change a value in it.
  // This is the benefit of ORM (mongoose) and/or object documents (Mongo NoSQL)
  // You can treat objects just like that - objects.
  // Normally you'd find a specific object, but we will only
  // give the user the ability to update our last object
  lastAddedDog.age++;

  // once you change all the object properties you want,
  // then just call the Model object's save function
  // create a new save promise for the database
  const savePromise = lastAddedDog.save();

  // send back the name as a success for now
  savePromise.then(() => res.json({
    name: lastAddedDog.name,
    breed: lastAddedDog.breed,
    age: lastAddedDog.age,
  }));

  // if save error, just return an error for now
  savePromise.catch((err) => res.status(500).json({ err }));
};

const notFound = (req, res) => {
  // res.render takes a name of a page to render.
  // These must be in the folder you specified as views in your main app.js file
  // Additionally, you don't need .jade because you registered the file type
  // in the app.js as jade. Calling res.render('index')
  // actually calls index.jade. A second parameter of JSON can be passed into
  // the jade to be used as variables with #{varName}
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// export the relevant public controller functions
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readCat,
  getName,
  setName,
  updateLast,
  searchName,
  readDog,
  getDogName,
  setDogName,
  updateLastDog,
  searchDogName,
  notFound,
};
