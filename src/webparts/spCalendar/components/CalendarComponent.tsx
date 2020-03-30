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
import ConfirmDialog from './ConfirmDialog';
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import './CommonStyleSheet.scss';
import { Button } from '@material-ui/core';
import * as moment from 'moment-timezone';

const CalendarComponent = ({ props }) => {
  let esdDetails = [];
  let calendarWeekends: boolean = true;
  const [dialogData, setDialogData] = useState([]);
  const [count, setCount] = useState(0);
  const [showLoader, setShowLoader] = useState(false)
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [calendarData, setCalendarData] = useState([]);

  const getListData = (param) => {
    setShowLoader(true);
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
              setShowLoader(false);
              esdDetails = response.data;
              esdDetails.forEach(element => {
                element['end'] = moment(element['Scheduled__bEnd']).utc().format();
                element['start'] = moment(element['Scheduled__bStart']).utc().format();
                element['title'] = ReactHtmlParser(element['mrTITLE']);

                if (element['mrSTATUS'] == 'Closed') {
                  element['className'] = "inactive" + " " + 'event' + element['mrID'];
                }
                else if(element['mrSTATUS'] == 'Canceled'){
                  element['className'] = "canceled" + " " + 'event' + element['mrID'];
                }else{
                  element['className'] = 'event' + element['mrID'];
                }
                element['id'] = element['mrID'];
              });
              setCalendarData(calendarData => calendarData.concat(response.data));
              if (param === 'closed') {
                setCount(1);
                let ele = document.getElementById('pastevents');
                ele.classList.add('disabled');
              }
            }
          }, err => {
            console.log(err);
          });
      });

  };
  // Show closed Events
  const showPastEvents = () => {
    if (count == 0) {
      setOpenConfirmDialog(true);
    }
  }
  const handleConfirmChildClick = (value: boolean) => {
    setOpenConfirmDialog(false);
    if (value) {
      // setCalendarData([]);
      getListData('closed');
    }
  }

  // Open dialog Box
  const openDialogBox = (item) => {
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


  // Add hover class
  const handleMouseOver = (event) => {
    if (event.el.classList.contains('event' + event.event.id)) {
      let elements = document.getElementsByClassName('event' + event.event.id);
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add('eventHover');
      }
    }

  };
  const handleMouseLeave = (event) => {
    if (event.el.classList.contains('event' + event.event.id)) {
      let elements = document.getElementsByClassName('event' + event.event.id);
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('eventHover');
      }
    }
  };
  return (
    <div >
      <ConfirmDialog props={openConfirmDialog} content={dialogData} onChildClick={handleConfirmChildClick} />
      {showLoader ? <div className="msSpinner">
        <Spinner label="Fetching data, wait..." size={SpinnerSize.large} />
      </div>
        : <Grid container spacing={3}>
          <Grid item xs={12} className="margin16px float-right">
            <Button variant="contained" color="primary" id="pastevents" onClick={showPastEvents}>
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
              timeZone={'UTC'}
              events={calendarData}
              weekends={calendarWeekends}
              eventMouseEnter={handleMouseOver}
              eventMouseLeave={handleMouseLeave}
              eventClick={handleDateClick}

            />
          </Grid>
        </Grid>

      }</div>

  )
}

export default CalendarComponent;