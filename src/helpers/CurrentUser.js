export class CurrentUser {
  static get() {
    const userSession = localStorage.getItem('userSession');
    return userSession ? JSON.parse(userSession) : null;
  }

  static set(payload) {
    const parsedPayload = JSON.stringify(payload);
    localStorage.setItem('userSession', parsedPayload);
  }

  static delete() {
    localStorage.removeItem('userSession');
    return true;
  }
}
