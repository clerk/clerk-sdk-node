import type {
  ClientJSON,
  ClientResource,
} from "../types/resources";
import { Session } from "./Session";

export class Client implements ClientResource {
  id: string;
  ended: boolean;
  sessions: Session[];
  signInAttemptId: string | null;
  signUpAttemptId: string | null;
  lastActiveSessionId: string | null;

  constructor(data: ClientJSON) {
    this.id = data.id;
    this.ended = data.ended;
    this.sessions =
      data.sessions
        ? data.sessions.map(
            (x) => new Session(x)
          )
        : [];
    this.signUpAttemptId = data.sign_in_attempt_id;
    this.signInAttemptId = data.sign_in_attempt_id;
    this.lastActiveSessionId = data ? data.last_active_session_id : null;
  }
}
