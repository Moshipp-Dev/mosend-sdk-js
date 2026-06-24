export interface ShiftReminderChannels {
  push?: boolean;
  inApp?: boolean;
  email?: boolean;
}

export interface ShiftReminderEvents {
  shiftStart?: boolean;
  lunchStart?: boolean;
  lunchEnd?: boolean;
  shiftEnd?: boolean;
}

export interface ShiftReminderSettings {
  enabled: boolean;
  channels: ShiftReminderChannels;
  events: ShiftReminderEvents;
  shiftStartLeadMin: number;
  shiftEndLeadMin: number;
}

export interface UpdateShiftReminderSettingsInput {
  enabled?: boolean;
  channels?: ShiftReminderChannels;
  events?: ShiftReminderEvents;
  shiftStartLeadMin?: number;
  shiftEndLeadMin?: number;
}
