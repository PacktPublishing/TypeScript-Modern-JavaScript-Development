/// <reference path="./interfaces"/>

class AppEvent implements IAppEvent {
  public guid : string;
  public topic : string;
  public data : any;
  public handler: (e: Object, data? : any) => void;

  constructor(topic : string, data : any, handler: (e: any, data? : any) => void) {
    this.guid = this.generateGuid();
    this.topic = topic;
    this.data = data;
    this.handler = handler;
  }

  // Generates a new GUID
  private generateGuid() : string {
    return this.s4() + this.s4() + '-' +
           this.s4() + '-' + this.s4() + '-' +
           this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  // Generates one of the sections of a GUID
  private s4() : string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}

export { AppEvent };
