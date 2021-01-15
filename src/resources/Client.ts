import type {
  ClientJSON,
  ClientResource,
} from "../types/resources";

export class Client implements ClientResource {
  id: string;
  sessionIds: string[];
  signInAttemptId: string | null;
  signUpAttemptId: string | null;
  lastActiveSessionId: string | null;
  createdAt: number;
  updatedAt: number;

  constructor(data: ClientJSON) {
    this.id = data.id;
    this.sessionIds = data.session_ids;
    this.signUpAttemptId = data.sign_in_attempt_id;
    this.signInAttemptId = data.sign_in_attempt_id;
    this.lastActiveSessionId = data ? data.last_active_session_id : null;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }
}
