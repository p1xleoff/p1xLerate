import moment from 'moment';

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
