const fs = require("fs");
  
// Storing the JSON format data in myObject
var data = fs.readFileSync("flow.json");
var myObject = JSON.parse(data);
  
// Defining new data to be added
let newData = {
  address: "1234",
  keys: "abcd"
};
  
// Adding the new data to our object
myObject.push(newData);
  
// Writing to our JSON file
var newData2 = JSON.stringify(myObject);
fs.writeFile("flow2.json", newData2, (err) => {
  // Error checking
  if (err) throw err;
  console.log("New data added");
});