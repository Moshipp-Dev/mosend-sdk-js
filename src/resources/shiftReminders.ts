import type {
  ShiftReminderSettings,
  UpdateShiftReminderSettingsInput,
} from "../types/shiftReminders.js";
import type { RequestOptions } from "../core/types.js";
import { Resource } from "./base.js";

export class ShiftRemindersResource extends Resource {
  /** Lee los recordatorios de jornada de los agentes. */
  async retrieve(scope: { orgId?: string } = {}, options?: RequestOptions): Promise<ShiftReminderSettings> {
    const orgId = this.requireOrgId(scope.orgId);
    const res = await this.http.request<ShiftReminderSettings>({
      method: "GET",
      path: `/organizations/${orgId}/shift-reminders`,
      ...(options ? { options } : {}),
    });
    return res.data;
  }

  /** Actualiza (parcial) los recordatorios de jornada. */
  async update(
    input: UpdateShiftReminderSettingsInput & { orgId?: string },
    options?: RequestOptions,
  ): Promise<ShiftReminderSettings> {
    const { orgId: scopedOrgId, ...body } = input;
    const orgId = this.requireOrgId(scopedOrgId);
    const res = await this.http.request<ShiftReminderSettings>({
      method: "PUT",
      path: `/organizations/${orgId}/shift-reminders`,
      body,
      ...(options ? { options } : {}),
    });
    return res.data;
  }
}
