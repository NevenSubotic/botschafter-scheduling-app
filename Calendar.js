const CAL = CalendarApp;


/**
 * Time-Slots are set within a set Calendar
 * Time-Slots are Calendar Events identified by the title "Blocker"
 * Actual Appointments are set within the User's Calendar
 */
// Time-Slots are set here
const officeHourId = "";

// Get the Calendar Id
function getOfficeHourId(){
  PropertiesService.getScriptProperties().getProperty("officeHourId")
}

// Currently only set in code, should add UI
function setOfficeHourId( id ){  
  return PropertiesService.getScriptProperties().setProperty("officeHourId", id)
}

// Personal Calendar from the user, confirmed events are copied to here
// Needs to be updated to allow for multiple users to use this app
const myCalId = "";

// Set this to a string which determines which events should be displayed
const calendarEventSearchParams = {
  search : "Blocker"
}

function getCalendars(){
  const cals = CAL.getAllCalendars();
  cals.forEach( cal => console.log(cal.getTitle(), cal.getId()) );
}

function getCalendarById(id) {
  try {
    return CAL.getCalendarById(id);
  } catch(err) {
    console.error(err)
  }
}

/**
 * @returns {Object} Events - Available time slots from Calendar
 */
function getAllEventsFromCalender(){
  const oneDay = 24 * 60 * 60 * 1000;
  const startTime = new Date();
  const endTime = new Date( startTime.getTime() + (N_DAYS_TO_DISPLAY_EVENTS * oneDay) );

  const eventCollection = [];
  
  try {
    const cal = getCalendarById(officeHourId);    
    const events = cal.getEvents(startTime, endTime, calendarEventSearchParams);
    
    events.forEach( event => eventCollection.push(generateEventObj(event)) ); 

    return JSON.stringify(eventCollection);

  } catch(err) {
    console.error(err)
  }

  function generateEventObj(event){
    return {
      id: event.getId(), 
      title: event.getTitle(), 
      start: event.getStartTime(), 
      end: event.getEndTime()
    }
  }
}