const fs = require('fs');
const removeDuplicates = require('./index');

const originalJSON = fs.readFileSync('./mock_application.json');
const originalJSONParsed = JSON.parse(originalJSON);
let cleanFile;
let cleanFileParsed;

describe('Remove Duplicates Tests', () => {
  beforeAll(() => {
    let data = originalJSONParsed.versions[0];
    removeDuplicates(data, 'objects', 'fields');
    removeDuplicates(data, 'scenes', 'views');
    cleanFile = fs.readFileSync('./clean_application.json');
    cleanFileParsed = JSON.parse(cleanFile);
  });

  test('Original JSON containing duplicated elements is not equal to the resulting Clean JSON', () => {
    expect(cleanFile).not.toEqual(originalJSON);
  });

  test('Clean JSON does not have any duplicated ID', () => {
    let checkForDuplicatedIDs = (collection, subcollection) => {
      let allIDs = [];
      let comparisonArr = [];
      let errorsArr = [];
      cleanFileParsed.versions[0][collection].forEach((obj) => {
        allIDs.push(obj._id);
        obj[subcollection].forEach((subelement) => {
          allIDs.push(subelement._id);
        });
      });
      allIDs.forEach((id) => {
        if (!comparisonArr.includes(id)) {
          comparisonArr.push(id);
        } else {
          errorsArr.push(id);
          console.log(errorsArr);
        }
      });
      if (!errorsArr.length) {
        return true;
      }
      return false;
    };

    expect(checkForDuplicatedIDs('objects', 'fields')).toBe(true);
    expect(checkForDuplicatedIDs('scenes', 'views')).toBe(true);
  });

  test('Clean JSON does not have any duplicated object', () => {
    let checkForDuplicatedObjects = (collection, subcollection) => {
      let allObjects = [];
      let comparisonArr = [];
      let errorsArr = [];

      cleanFileParsed.versions[0][collection].forEach((obj) => {
        const withoutIDcollection = (({ _id, ...o }) => o)(obj);
        const clonCollection = JSON.stringify(withoutIDcollection);
        allObjects.push(clonCollection);
        obj[subcollection].forEach((subelement) => {
          const withoutIDsubcollection = (({ _id, ...o }) => o)(subelement);
          const clonSubcollection = JSON.stringify(withoutIDsubcollection);
          allObjects.push(clonSubcollection);
        });
      });
      allObjects.forEach((obj) => {
        if (!comparisonArr.includes(obj)) {
          comparisonArr.push(obj);
        } else {
          errorsArr.push(obj);
          console.log(errorsArr);
        }
      });
      if (errorsArr.length) {
        return false;
      } else {
        return true;
      }
    };

    expect(checkForDuplicatedObjects('objects', 'fields')).toBe(true);
    expect(checkForDuplicatedObjects('scenes', 'views')).toBe(true);
  });

  /*  test("Returned JSON does not have any repeated values", () => {
    let result = () => {
      let arrIDsRemoved = file.removeDuplicates(data, "objects", "fields");
      arrIDsRemoved.forEach((id) => {
        if (JSON.stringify(cleanFileParsed).includes(id)) {
          console.log("did not work");
          return false;
        } else {
          console.log(
            "it worked, none of the removedIDs appears in the new file"
          );
          return true;
        }
      });
    };

    expect(result).toBe(true);
  }); */
});
