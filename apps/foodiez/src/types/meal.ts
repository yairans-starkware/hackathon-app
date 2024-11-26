export type Meal = {
  id: string;
  time: {seconds: number};
  number_of_participants: number;
  registered?: boolean;
  canceled?: boolean;
}
