/**
* @OnlyCurrentDoc
*/

const ActiveSheet = SpreadsheetApp.getActiveSheet();

/**
 * SETTINGS
 * Make sure you set the following according to your needs
 */

// This is where responses from the Web-App Form are saved, make sure the Sheet exists
const TARGET_SHEET_NAME = "Anfragen"

// Slots x Days into the future will be displayed, i.e. all slots in the next 90 days will be displayed
const N_DAYS_TO_DISPLAY_EVENTS = 90;

/**
 * This just loads the WebApp when someone visits the URL with a Browser
 */
function doGet(){
  return HtmlService.createTemplateFromFile("index").evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Load the Editor Add-On Menu in Sheets
 */
function onOpen(){
  SpreadsheetApp.getUi().createMenu("n2s")
    .addItem("Confirm Event", "confirmationSelectionHandler")
    .addToUi()
}


/**
 * 
 */
function getMeetLink(eventId){
  const eventIdWithoutDomain = eventId.replace("@google.com", "");
  const event = Calendar.Events.get("primary", eventIdWithoutDomain);
  if( !event ){
    console.error("Could not find event to get a Meet Link from");
    return;
  }
  if( !event.hangoutLink ){
    console.error("No Hangout Meet Link available");
    return;
  }

  return event.hangoutLink || "";
}


/**
 * Returns the Link to the Botschafter-Overview, based on the email provided as a lookup
 * @param String Email - Email to lookup to. Case-insensitive.
 * @returns String Url - Link to the page for this particular user/email
 */
function getSFLinkFromEmail(email){
  const sheetWithLinks = "Punkteeinsicht";
  const targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetWithLinks);
  const rowsAsObj = SheetsLibrary.getAllRowsAsObjInArr(targetSheet,1);
  let output;
  
  rowsAsObj.forEach( row => {
    if( row.Email.toLowerCase() == email.toLowerCase() ){      
      output = row["Link zum Portal"];
    }
  });

  return output
}


/**
 * When Manager confirms an event by selecting it, the Calendar Event is updated
 * The related events from the submission are disabled
 * A new Calendar event is created in the users personal Calendar
 */
function confirmationSelectionHandler(){
  const header = SheetsLibrary.getHeaderAsObjFromSheet(ActiveSheet, 1);
  const allEvents = SheetsLibrary.getAllRowsAsObjInArr(ActiveSheet, 1);
  const events = SheetsLibrary.getSelectedRowsAsObjInArr(ActiveSheet, 1);
  const selectedEvent = events[0];
  console.log(selectedEvent);
  if( !isReady() ) return

  try {
    // Update Jour Fixe Calendar Event
    const jourFixeCal = CAL.getCalendarById(officeHourId);
    const eventInCal = jourFixeCal.getEventById(selectedEvent.id);
    const newTitleForEvent = "Jour Fixe | " + selectedEvent.user;
    const start = eventInCal.getStartTime();
    const end = eventInCal.getEndTime();
    
    let calDescription = getSFLinkFromEmail(selectedEvent.Email) ? `Hier ist der Link zu deinen Botschafter-Kampagnen: ` + getSFLinkFromEmail(selectedEvent.Email) : "";      
    
    // Create Calendar Event in personal Call
    const myCal = CAL.getCalendarById(myCalId);
    const newCalEvent = myCal.createEvent( newTitleForEvent, start, end);
    eventInCal.setTitle( newTitleForEvent );

    if( newCalEvent ){
      // Add the Meet Link to the Description
      // Need to either get the Meet Link, if it is there, or create a Meeting using the Advanced Calendar API
      const meetLink = getMeetLink(newCalEvent.getId());  //Calendar.Events.get(myCalId, newCalEvent.getId());
      if( meetLink )
        calDescription += `\nHier ist der Link zum Gespräch: ${meetLink}`;
      newCalEvent.setDescription( calDescription );
      eventInCal.setDescription( calDescription );
      
      updateField( selectedEvent.rowNum, header.status, newCalEvent.getId() );
      disableOtherEventsFromThisSubmission(); 
      newCalEvent.addGuest( selectedEvent.Email );
      sendConfirmationToBotschafter( {
        email: selectedEvent.Email,
        subject: `Bestätigung Jour-Fixe am ${selectedEvent.Datum}`,
        body: `Hi ${selectedEvent.user},\nhiermit bestätige ich deinen Jour-Fixe-Termin am ${selectedEvent.Datum} um ${selectedEvent.Uhrzeit}.\nLiebe Grüße,\nShari`
      });
    }
  } catch(err) {
    console.error("Fehler: "+err);
    alert("Could not create Event: "+err.message);
  }

  // Disable other events from the same submission  
  function disableOtherEventsFromThisSubmission( ){
    const eventsFromThisSubmission = allEvents.filter( event => event.submissionId === selectedEvent.submissionId && event.id != selectedEvent.id ) ;
    eventsFromThisSubmission.forEach( event => updateField( event.rowNum, header.status, "disabled") );
  }
  
  // Checks to see if event selected is empty and not disabled
  function isReady(){
    if( events.length > 1 ){
      alert("Bitte nur eine auswählen");
      return
    }
    
    if( selectedEvent.status === "disabled" ){
      alert("Eintrag ist disabled und kann nicht erstellt werden");
      return
    }
    
    if( selectedEvent.status != "" ){
      alert("Eintrag hat bereits einen Status und kann deshalb nicht neu erstellt werden.");
      return
    }
      
    return true
  }
}

/**
 * Store the Form Values from the WebApp into the Target Sheet
 */
function handleFormSubmissionFromUser(arrayOfEvents){
  const sheet = SpreadsheetApp.getActive().getSheetByName(TARGET_SHEET_NAME);
  const events = JSON.parse(arrayOfEvents);
  const today = new Date().toISOString().substr(0,10);
  const randomNum = Math.round((Math.random() + 1) * 1000);
  const idForSubmission = events[0].user + randomNum;

  events.forEach( event => sheet.appendRow([event.id, today, event.user, event.email, event.startDate, event.startTime, event.start, idForSubmission]) );
}

/**
 * Send a Event Confirmation Email to Botschafter
 */
function sendConfirmationToBotschafter(emailObj = {email: "neven@n2s.ngo", body: "Test Message", subject : "Test Subject"}){
  GmailApp.sendEmail(emailObj.email, emailObj.subject, emailObj.body)
}