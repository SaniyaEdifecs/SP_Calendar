import * as React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import DialogBox from './DialogBox';
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import './CommonStyleSheet.scss';
import { Button } from '@material-ui/core';

const CalendarComponent = ({ props }) => {
  let esdDetails = [];
  let calendarWeekends: boolean = true;
  const [dialogData, setDialogData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [addClass, setAddClass] = useState(false);
  const getListData = (param) => {
    props.context.aadHttpClientFactory
      .getClient('https://api-fp-it-cm.azurewebsites.net')
      .then((client: AadHttpClient): void => {
        client
          .get('https://api-fp-it-cm.azurewebsites.net/api/it-cm?call=' + param, AadHttpClient.configurations.v1)
          .then((response: HttpClientResponse): Promise<any> => {
            return response.json();
          })
          .then((response: any): void => {
            if (response.data) {
              esdDetails = response.data;
              console.log("checkkkk", response.data);
              esdDetails.forEach(element => {
                element['end'] = element['Scheduled__bEnd'];
                element['start'] = element['Scheduled__bStart'];
                element['title'] = ReactHtmlParser(element['mrTITLE']);
                element['className'] = 'event' + element['mrID'];
                element['id'] = element['mrID'];
              });
              setCalendarData(response.data);

            }
          }, err => {
            console.log(err);
          });
      });

  };
  // Show closed Events
  const showPastEvents = (param) => {
    setCalendarData([]);
    getListData(param);
  }
  // Open dialog Box
  const openDialogBox = (item) => {
    // e.preventDefault();
    setDialogData(item);
    setOpenDialog(true);
  };
  const handleChildClick = (value: boolean) => {
    setOpenDialog(value);
  }
  useEffect(() => {
  }, [openDialog]);

  useEffect(() => {
    getListData('active');
  }, []);

  useEffect(() => {
  }, [calendarData]);

  const handleDateClick = (info) => {
    openDialogBox(info.event.extendedProps);
  }

  const handleMouseOver = (event) => {
    console.log(event);
    if (event.el.classList.contains('event' + event.event.id)) {
    
      console.log('true');
    }
    // $(".event"+event.id).addClass("eventHover");
  };

  return (
    <div >

      <h2>CM Calendar</h2>
      {calendarData.length > 0 ?
        <Grid container spacing={3}>
          <Grid item xs={12} className="margin16px float-right">
            <Button variant="contained" color="primary" onClick={() => showPastEvents('closed')}>
              Load older events
       </Button>
          </Grid>
          <Grid item xs={12} >
            <DialogBox props={openDialog} content={dialogData} onChildClick={handleChildClick} />

            <FullCalendar defaultView="dayGridMonth"
              header={{
                left: 'prev,next today',
                center: 'title',
                right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
              }} plugins={[dayGridPlugin, timeGridPlugin]}
              height={700}
              events={calendarData}
              weekends={calendarWeekends}
              eventMouseEnter={handleMouseOver}
              eventClick={handleDateClick}
              
            />
          </Grid>
        </Grid> :
        <div className="msSpinner">
          <Spinner label="Fetching data, wait..." size={SpinnerSize.large} />
        </div>
      }</div>

  )
}

export default CalendarComponent;