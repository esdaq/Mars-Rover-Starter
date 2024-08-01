class Rover {
   constructor(position) {
    this.position = position;
    this.mode = "Normal";
    this.generatorWatts = 110;
   }

   receiveMessage(message) {
    let results = [];
    let resp = {};
    message.commands.forEach(c => {
      if(c.commandType === "STATUS_CHECK") {
        results.push({
          completed: true,
          roverStatus: {
            mode: this.mode,
            generatorWatts: this.generatorWatts,
            position: this.position
          }
        });
      } else if(c.commandType === "MODE_CHANGE" && c.value === "LOW_POWER") {
        this.mode = "LOW_POWER";
        results.push({completed: true});
      } else if(c.commandType === "MODE_CHANGE" && c.value === "NORMAL") {
        this.mode = "NORMAL";
        results.push({completed: true});
      } else if(c.commandType === "MOVE") {
        if(this.mode === "LOW_POWER"){
          results.push({completed: false});
        } else {
          this.position = c.value;
          results.push({completed: true});
        }
      } else {
        results.push({});
      }
    });

    resp = {
      message: message.name,
      results: results
    };
    return resp;
   }
}

module.exports = Rover;