const mongoose = require('mongoose');

let DogModel = {};

const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    // unique: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  breed: {
    type: String,
    // default: 'Unknown breed',
    trim: true,
    // required: true,
  },
  age: {
    type: Number,
    // required: true,

  },

});

DogSchema.statics.findByName = (name, callback) => {
  const search = {
    name,
  };

  return DogModel.findOne(search, callback);
};

DogModel = mongoose.model('Dog', DogSchema);

module.exports.DogModel = DogModel;
module.exports.DogSchema = DogSchema;
