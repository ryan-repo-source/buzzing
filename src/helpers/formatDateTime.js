function formatDateTime(datetimeStr) {
  const date = new Date(datetimeStr.replace(' ', 'T'));
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const datePart = date.toLocaleDateString('en-US', options);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; 
  const timePart = `${hours}:${minutes} ${ampm}`;
  return `${datePart} at ${timePart}`;
}

export default formatDateTime;