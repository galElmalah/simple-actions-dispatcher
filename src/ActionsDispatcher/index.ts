type Action = (args?: any) => any

interface Dispatcher<T> {
  register(actionType: keyof T, action: string | Action): void;
  dispatch(actionType: keyof T): void;
}


export class ActionsDispatcher<T> implements Dispatcher<T>{

  private actions: Record<keyof T | string | 'default', Action[]>;

  constructor(defaultAction?: Action) {
    defaultAction ?
      //@ts-ignore
      (this.actions = { default: [defaultAction] }) :
      //@ts-ignore
      (this.actions = {});
  }

  setDefaultAction(defaultAction: Action) {
    //@ts-ignore
    this.actions.default = [defaultAction]
  }

  /**
   * @param actionType the type (identifier) you want to attach an action to
   * @param action could either be a a function or a another actionType if its an actionType then the action associated with that actionType will be attached to the specified actinType
   */
  register(actionType: keyof T, action: string | Action) {
    if (typeof action === 'string') {
      this.actions[actionType as keyof T] = this.actions[action];
      return;
    }

    if (this.actions[actionType]) {
      this.actions[actionType] = [...this.actions[actionType], action];
      return;
    }
    this.actions[actionType] = [action];
  }

  dispatch(actionType: keyof T | string, ...args: any[]) {
    if (!this.actions[actionType] && !this.actions.default) {
      throw new TypeError(`No action of type ${actionType} has been registered.`);
    }

    if (!this.actions[actionType]) {
      const defaultAction = this.actions.default[0]
      args ? defaultAction(...args) : defaultAction();
      return;
    }
    const actions = this.actions[actionType];
    actions.forEach(action => (args ? action(...args) : action()));
  }


} 