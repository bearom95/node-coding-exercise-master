const fs = require('fs');

let rawdata = fs.readFileSync('./mock_application.json');
let parsedJSON = JSON.parse(rawdata);

const data = parsedJSON.versions[0];

const removeDuplicates = (data, collection, subcollection) => {
  let firstArrIDs = [];
  let firstArrClones = [];
  data[collection].forEach((obj) => {
    const withoutID = (({ _id, ...o }) => o)(obj);
    const clon = JSON.stringify(withoutID);
    if (!firstArrIDs.includes(obj._id)) {
      firstArrIDs.push(obj._id);
      if (!firstArrClones.includes(clon)) {
        firstArrClones.push(clon);
      } else {
        console.log(
          `The element with ID ${obj._id} from the "${collection}" array was duplicated and has been removed. 
          `,
        );
        let index = data[collection].indexOf(obj);
        data[collection].splice(index, 1);
      }
    } else {
      console.log(
        `The element with ID ${obj._id} from the "${collection}" array was duplicated and has been removed.
        `,
      );
      const index = data.indexOf(obj);
      data.splice(index, 1);
    }

    let secondArrIDs = [];
    let secondArrClones = [];
    obj[subcollection].forEach((subelement) => {
      const withoutID = (({ _id, ...o }) => o)(subelement);
      const clon = JSON.stringify(withoutID);

      if (!secondArrIDs.includes(subelement._id)) {
        secondArrIDs.push(subelement._id);
        if (!secondArrClones.includes(clon)) {
          secondArrClones.push(clon);
        } else {
          console.log(
            `The element with ID ${subelement._id} from the "${subcollection}" array was duplicated and has been removed. 
            `,
          );
          let index = obj[subcollection].indexOf(subelement);
          obj[subcollection].splice(index, 1);
        }
      } else {
        console.log(
          `The element with ID ${subelement._id} from the "${subcollection}" array was duplicated and has been removed.
          `,
        );
        const index = obj[subcollection].indexOf(subelement);
        obj[subcollection].splice(index, 1);
      }
    });
  });

  fs.writeFileSync(
    'clean_application.json',
    JSON.stringify(parsedJSON, null, 4),
    (err) => {
      if (err) console.log(err);
      else {
        console.log('File written successfully\n');
      }
    },
  );
};

removeDuplicates(data, 'objects', 'fields');
removeDuplicates(data, 'scenes', 'views');

module.exports = removeDuplicates;
