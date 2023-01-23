### SCRIPT EXPLANATION

The task consists of generating a code that processes the data contained in the given file, removes any duplicates and outputs a new clean JSON file.

In order to achieve it, I’ve used Node.js and JavaScript, you can find the code in the `index.js` file and you can run it typing the next commands: `npm i` (to install node_modules) and `npm run dev`

To perform unit tests I’ve used Jest. The `removeDuplicates.test.js` file verifies that the clean JSON file generated after running the script, has worked as expected.

I’ve also used ESLint and Prettier in order to generate a cleaner code and avoid syntax errors. These tools help us to keep a consistent style and generate common internal rules to work better with our team.

### index.js file

After running the code, you will see some messages in the terminal that inform you about the duplicates found and removed, and you will see how a new file called `clean_application.json` has been created.

The code itself:

1. I’ve used the file system module (fs) in order to be able to read and write files.

2. I created a function called `removeDuplicates` that operates at 2 different levels.

   It receives 3 parameters:

   - Data: the JSON path common to all collections
   - Collection: First level of objects, in this case `objects` or `scenes`
   - Subcollection: Deeper level, in this case `fields` or `views`

   The first part of the function finds the duplicated elements within the first level (collection). By using a forEach loop, the code checks every collection (object or scene). First, we look for any duplicated ID and in case an ID appears more than once, one of the objects is removed.

   If there’s no duplicated IDs, one more verification needs to be done. There’s also the possibility that we have an object or scene identical to another except for its ID. I understand this is also a duplication error that should be controlled. It might be the case that the same object is created twice but if the database does not check this scenario, it could assign a new ID to an identical element. To perform this verification, my script copies the object except its ID and looks for duplicates, deleting one of the them.

   The second part of the function works the same way but operates at a deeper level, since each collection (objects or scenes) contains subcollections (fields or views) respectively.

   The function ends by generating a new file named `clean_application.json` which contains the data without duplications. The potential error is captured and printed, and a message in the terminal appears in case of success.

3. The code executes the function twice, once per set of collection and subcollection. It has been created this way in case the JSON will change in the future and the collections or subcollections acquire different naming or the JSON grows.

### removeDuplicates.test.js

You can type the next command to run it: `npm run test`

Before executing any of the tests, we declare data and assign it a value. At this point, the script also executes the function tested. This step was included in order to prevent the test to fail due to the absence of a clean JSON file, this way we make sure that there’s always a clean JSON.

There are 3 different tests:

1. First test: Assuming that the original JSON actually contains duplicated elements, this test compares both files (original and clean) and expects them to differ.

2. Second test: This test checks for duplicated IDs in the clean JSON file. In case any duplication is found, the script pushes it to an array whose length is checked. If the array has any element, it means that the clean JSON has at least two identical IDs and the function will return false (test failed). But if the array is empty, the function will return true, which is the result expected by the test in order to pass.

3. Third test: Applying the same logic, this test looks for duplicated objects (except for their IDs) in the clean JSON file. The function returns false when any of the objects appears more than once in the clean file, and it returns true and consequently passes the test when it finds none.
