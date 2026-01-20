export function timeGreeting(name) {
  const h = new Date().getHours();
  let part = 'Good evening';
  if (h < 12) part = 'Good morning';
  else if (h < 18) part = 'Good afternoon';
  if (name) return `${part}, ${name}`;
  return part;
}
