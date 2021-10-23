# Scheduling App
This app handles scheduling using Google Calendar and a public Web-App using Google Apps Script. In use there are two users, the Manager and the User (called Botschafter in the code). The Manager defines the available time slots and confirms the requests from the Users. Users use the public Web-App to select a number of available slots.

Google Calendar (Manager)
 - Set the free time slots
 - When slots are confirmed, a Event in that users Calendar is created

Web-App (User)
  - Select / Request available slots

Google Spreadsheet (Manager)
  - See and confirm requests by Users
  - Acts as Controller for / between Web-App, Google Calendar and the Sheet
  - Notifies User when Manager has confirmed request per Email and invites User to Event


### Setup

#### First Steps**
1. Create a new Spreadsheet
1. Create a new Sheet and name it something like `Responses`
1. [Create](https://developers.google.com/apps-script/guides/bound) a container-bound Apps Script Project in the Spreadsheet
    1. [Enable](https://developers.google.com/apps-script/guides/services/advanced) Advanced Service > Calendar App
    1. [Add](https://developers.google.com/apps-script/guides/libraries) a new Library
1. [Create](https://support.google.com/calendar/answer/37095?hl=en) a new Calendar to hold the slots


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

### Almost Ready
1. [Deploy](https://developers.google.com/apps-script/concepts/deployments) as [WebApp](https://developers.google.com/apps-script/guides/html#serve_html_as_a_web_app) and use the link it provides to send to users.

### Usage
1. In you Calendar from `First Steps > 4`, add Slots with the title from `Code > Calendar > Line 28`. These will then be immediately available in the WebApp when users visit your site.
1. When users visit your site, their form submissions will be stored in the `Code > TARGET_SHEET_NAME`. A submission will contain multiple events.
1. When your manager then views the responses and selects a particular event within the sheet, they can then click on `n2s > Confirm Event` (in the Toolbar) and a new Event will be created in their Calendar (which is set in `Calendar > Line 24`). The event will contain the Title and Description set within `Code > Lines 92, 96`
