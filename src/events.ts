import * as EventEmitter from "events";

export default function events() {
  const eventEmitter = new EventEmitter();
  const event = "event";

  const one = () => {
    console.log("one");
  };

  const two = () => {
    console.log("two");
  };

  const justOnce = () => {
    console.log("just once!");
  };

  // Will run in the order in which they were attached
  eventEmitter.on(event, one);
  eventEmitter.on(event, two);

  // Will log data passed on emission
  eventEmitter.on(event, (data) => {
    console.log("Data: ", data);
  });

  // Will run just once
  eventEmitter.once(event, justOnce);

  console.log("Emitting event with all listeners: ");
  eventEmitter.emit(event, { hasData: true });

  eventEmitter.removeListener(event, one);

  console.log("Emitting event after removing 'one'");
  eventEmitter.emit(event, { hasData: true });

  eventEmitter.removeAllListeners();

  console.log("Emitting event after removing all listeners");
  eventEmitter.emit(event);
}
