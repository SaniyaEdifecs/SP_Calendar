import * as React from 'react';
import styles from './SpCalendar.module.scss';
import { ISpCalendarProps } from './ISpCalendarProps';
import CalendarComponent from './CalendarComponent';

const SpCalendar = (props) => {
  return (
    <div className={styles.spCalendar}>
      <CalendarComponent props={props}/>
    </div>
  );

}

export default SpCalendar;