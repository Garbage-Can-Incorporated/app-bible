export interface IAlarmDetail {
  id?: string; // database assigned string
  time: number;
  repeat: boolean; // repeat determines if day would be populated
  days?: Array<number>; // array of numbers 0 -> 6
  label:  string; // content of alarm
  status: boolean;
}
