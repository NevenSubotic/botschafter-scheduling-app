# botschafter-scheduling-app


### Setup

#### First Steps**
1. Create a new Spreadsheet
1. Create a new Sheet and name it something like `Responses`
1. [Create](https://developers.google.com/apps-script/guides/bound) a container-bound Apps Script Project in the Spreadsheet
    1. [Enable](https://developers.google.com/apps-script/guides/services/advanced) Advanced Service > Calendar App
    1. [Add](https://developers.google.com/apps-script/guides/libraries) a new Library
1. Create a new Calendar to hold the slots


#### Modifications in Code
**Calendar**
 - `Line 10` enter the `officeHourId` - Use `getCalendars()` to log out your Calendars with their Id. This is the Calendar from step 4 above. It will hold only the available slots.
 - `Line 24` enter the `myCalId` - This could be your email, e.g. john@acme.com. This is where new Events will be created once they are confirmed.
 - `Line 28` enter the search term for your calendar event blockers, it is currently `Blocker`

**Code**
 - `Line 13` enter the `TARGET_SHEET_NAME ` - This sheet will store responses from the form.
 - `Line 16` enter the `N_DAYS_TO_DISPLAY_EVENTS` - Only slots this many days in the future will be diplayed in the selection.
 - `Line 92` customize the `Event Title` if you like.
 - `Line 96` customize the `Event Description` if you like.

 **js.html**
  - `Line 3` customize the `MIN_SELECTED_EVENTS` - a user needs to at least select this many events.
  - `Line 4` same as above, but `MAX`