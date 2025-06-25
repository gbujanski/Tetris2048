export const getColor = (value: number): string => {
  if (value < 128) return 'red';
  if (value < 256) return 'blue';
  if (value < 512) return 'green';
  if (value < 1024) return 'yellow';
  if (value < 2048) return 'purple';
  if (value < 4096) return 'orange';
  if (value < 8192) return 'pink';
  if (value < 16384) return 'brown';
  if (value < 32768) return 'gray';
  if (value < 65536) return 'black';
  return 'white';
}