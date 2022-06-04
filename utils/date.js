import m from 'moment';

export default () => {
  const startOfMonth = () => m().startOf('month');
  
  const endOfMonth = () => m().endOf('month');
  
  const now = () => m();

  return {
    startOfMonth,
    endOfMonth,
    now
  }
}