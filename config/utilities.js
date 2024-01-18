import moment from 'moment';
import { Divider, Icon } from "react-native-paper";

export const calculateTotalDuration = (subroutines) => {
  let totalDurationInSeconds = 0;

  subroutines.forEach((subroutine) => {
    if (subroutine && subroutine.duration) {
      const durationParts = subroutine.duration.split(/\s+/);
      for (let i = 0; i < durationParts.length; i += 2) {
        const value = parseInt(durationParts[i]);
        if (!isNaN(value)) {
          if (durationParts[i + 1].includes('hour')) {
            totalDurationInSeconds += value * 60 * 60;
          } else if (durationParts[i + 1].includes('minute')) {
            totalDurationInSeconds += value * 60;
          } else if (durationParts[i + 1].includes('second')) {
            totalDurationInSeconds += value;
          }
        }
      }
    }
  });

  const duration = moment.duration(totalDurationInSeconds, 'seconds');
  const formattedDuration = [];

  if (duration.hours() > 0) {
    formattedDuration.push(`${duration.hours()} hour${duration.hours() > 1 ? 's' : ''}`);
  }
  if (duration.minutes() > 0) {
    formattedDuration.push(`${duration.minutes()} minute${duration.minutes() > 1 ? 's' : ''}`);
  }
  if (duration.seconds() > 0) {
    formattedDuration.push(`${duration.seconds()} second${duration.seconds() > 1 ? 's' : ''}`);
  }

  return formattedDuration.join(' ');
};

//calculate number of subroutines in a routine
export const calculateTotalSubroutines = (subroutines) => {
  // Check if subroutines is defined and not null
  if (subroutines && subroutines.length) {
    // Calculate total subroutines
    return subroutines.length;
  } else {
    // Handle the case when subroutines is not defined or empty
    return 0;
  }
};

export const calculateRoutineStatus = (routine) => {
  const completedSubroutines = routine.subroutines.filter(
    (subroutine) => subroutine.completed
  );

  return completedSubroutines.length === routine.subroutines.length
  ? <Icon source="check" color="#fff" size={24} />
  : <Icon source="timer-sand" color="#fff" size={24} />;
};

export const calculateNextOccurrence = (routine) => {
  const currentDay = moment().format('dddd').toLowerCase();
  const routineDays = Object.keys(routine.selectedDays).filter(
    (day) => routine.selectedDays[day]
  );

  const selectedDaysCount = routineDays.length;
  if (selectedDaysCount === 0) {
    return 'No days selected';
  }

  const currentDayIndex = routineDays.indexOf(currentDay);
  if (currentDayIndex !== -1) {
    return `Today, ${moment(routine.selectedTime).format('LT')}`;
  }

  const sortedDays = routineDays.sort((a, b) => {
    const aIndex = moment().isoWeekday(a);
    const bIndex = moment().isoWeekday(b);
    return aIndex - bIndex;
  });

  const nextDay = sortedDays.find((day) => moment().isoWeekday(day) > currentDayIndex);
  if (!nextDay) {
    return `${routineDays[0]} at ${moment(routine.selectedTime).format('LT')}`;
  }

  return `${capitalizeFirstLetter(nextDay)}, ${moment(routine.selectedTime).format('LT')}`;
};

export const resetRoutineStatus = (routine) => {
  const now = moment();
  const midnight = moment().endOf('day');

  if (now.isAfter(midnight)) {
    // Reset routine status here
    // For example, you can set all subroutines to incomplete
    const updatedSubroutines = routine.subroutines.map(subroutine => ({ ...subroutine, completed: false }));
    const updatedRoutine = { ...routine, subroutines: updatedSubroutines };

    // You may need to save the updatedRoutine to storage or update the state accordingly
    return updatedRoutine;
  }

  return routine;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};