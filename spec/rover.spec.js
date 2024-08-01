const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  it("constructor sets postion and default values for mode and generatorWatts", function() {
    let rover = new Rover(5000);
    expect(rover.position).toBe(5000);
    expect(rover.mode).toBe("Normal");
    expect(rover.generatorWatts).toBe(110);
  });

  it("response returned by receiveMessage contains the name of the message", function() {
    let rover = new Rover(5000);
    let commands = [new Command("My Command", "Some Value")];
    //let commands = [];
    let message = new Message("Test", commands);
    expect(rover.receiveMessage(message).message).toBe("Test");
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function(){
    let rover = new Rover(5000);
    let commands = [new Command("First Command", "Some Value"), new Command("Second Command", "Some Value")];
    let message = new Message("A message with two commands", commands);
    expect(rover.receiveMessage(message).results.length).toBe(2);
    //expect(rover.receiveMessage(message).results[0].constructor.name).toBe("Object");
  });

  it("responds correctly to the status check command", function(){
    let rover = new Rover(5000);
    let commands = [new Command("STATUS_CHECK")];
    let message = new Message("Checking the status", commands);
    expect(rover.receiveMessage(message).results[0].roverStatus.mode).toBe("Normal");
    expect(rover.receiveMessage(message).results[0].roverStatus.generatorWatts).toBe(110);
    expect(rover.receiveMessage(message).results[0].roverStatus.position).toBe(5000);
  });

  it("responds correctly to the mode change command", function(){
    let rover = new Rover(5000);
    let c1 = [new Command("MODE_CHANGE", "LOW_POWER")];
    let c2 = [new Command("MODE_CHANGE", "NORMAL")];
    let m1 = new Message("Changing the mode to low power", c1);
    let m2 = new Message("Changing the mode to normal", c2);
    expect(rover.receiveMessage(m1).results[0].completed).toBe(true);
    expect(rover.mode).toBe("LOW_POWER");
    expect(rover.receiveMessage(m2).results[0].completed).toBe(true);
    expect(rover.mode).toBe("NORMAL");
  });

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function() {
    let rover = new Rover(5000);
    //rover.mode = "LOW_POWER";
    let commands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("MOVE", 10000), new Command("STATUS_CHECK")];
    let message = new Message("Trying to move", commands);
    expect(rover.receiveMessage(message).results[1].completed).toBe(false);
    expect(rover.receiveMessage(message).results[2].roverStatus.position).toBe(5000);
    expect(rover.position).toBe(5000);
  });

  it("responds with the position for the move command", function(){
    let rover = new Rover(5000);
    let commands = [new Command("MOVE", 10000)];
    let message = new Message("Trying to move", commands);
    expect(rover.receiveMessage(message).results[0].completed).toBe(true);
    expect(rover.position).toBe(10000);
  });
});
