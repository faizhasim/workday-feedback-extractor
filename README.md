# Workday Feedback to Miro

1. Export Excel from workday feedback somewhere into you filesystem.

2. Remove first row of the Excel spreadsheet and clean up any feedback you want to omit.

3. Extract excel into json into clipboard

        node index.js workday-exports/person-name.xlsx |  pbcopy

4. Create new Miro board on the browser. Paste the clipboard content into browser debugger.

5. Copy the javascript in [miro-on-browser.js](./miro-on-browser.js) and paste it into browser debugger again.

6. Save the Miro board as usual. Ensure the permission is set accordingly.

        
