const mongoose = require("mongoose");
const { User } = require("../../models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/slack-clone", {
  useNewUrlParser: true,
  useFindAndModify: false
})

const storiesSeed = [
  {
    name: 'Caleb Crum',
    password: 'testtest',
    email: 'ccrum292@gmail.com',
    dateCreated: new Date().setDate(new Date().getDate())
  },
];

User.deleteMany({})
  .then(() => User.collection.insertMany(storiesSeed))
  .then(data => {
    console.log(data.result.n + " records insterted");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });