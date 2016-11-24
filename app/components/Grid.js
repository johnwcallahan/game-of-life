var Header = require("./Header.js");
var LifeBoard = require("../LifeBoard.js");
var React = require('react');

var simRunning = false,
    simulation, 
    isMouseDown,
    speedMap = {slow: 200, medium: 100, fast: 50},
    simSpeed = speedMap.medium,
    colorMap = {
      one:   {primary: "#5EB200", secondary: "#004366", grid: "#00324D"},
      two:   {primary: "#F4A300", secondary: "#660004", grid: "#4D0003"},
      three: {primary: "#43004C", secondary: "#E6FFD7", grid: "#B6FF8B"},
      four:  {primary: "#CACACA", secondary: "#282828", grid: "#323232"},
    };


//These functions help onmouseover events
document.onmousedown = function() { isMouseDown = true; };
document.onmouseup = function() { isMouseDown = false; };

var Grid = React.createClass({
  
  getInitialState: function() {
    return { board: LifeBoard.board, 
             generation: 1, 
             primaryColor:   colorMap.one.primary,
             secondaryColor: colorMap.one.secondary,
             gridLineColor:  colorMap.one.grid
           };
  },

  //Run simulation on page load
  componentDidMount: function() { 
    this.runSimulation();
  },

  //Updates board and generation continuously at the rate of sim speed
  runSimulation: function() {
    if (simRunning) return; //Prevents simultaneous instances of simulation
    var self = this;
    simulation = setInterval(function() {
      simRunning = true;
      var genCounter = self.state.generation + 1;
      self.setState({ board: LifeBoard.nextGen(), generation: genCounter});
    }, simSpeed);
  },

  //Stops simulation
  stopSimulation: function() {
    clearInterval(simulation);
    simRunning = false;
  },

  //Advances board and generation count by one
  advanceOneGeneration: function() {
    this.stopSimulation();
    var genCounter = this.state.generation + 1;
    this.setState({ board: LifeBoard.nextGen(), generation: genCounter});
  },

  //Changes sim speed according to button press
  changeSimSpeed: function(event) {
    var id = event.target.getAttribute("id");
    simSpeed = speedMap[id];
    this.stopSimulation();
    this.runSimulation();
  },

  //Clears board and stops simulation
  clearBoard: function() {
    this.setState({ board: LifeBoard.clearBoard(), generation: 1 });
    this.stopSimulation();    
  },

  //Generates random board (does not stop simulation)
  randomBoard: function() {
    this.setState({ board: LifeBoard.randomBoard(), generation: 1});
  },

  //Changes color scheme based on user input
  changeColorScheme: function(event) {
    var value = event.target.value;
    this.setState({ primaryColor:   colorMap[value].primary, 
                    secondaryColor: colorMap[value].secondary, 
                    gridLineColor:  colorMap[value].grid })
  },

  //Changes status of cell on mouseover while clicked or on click
  cellStatusChange: function(event) {
    if (isMouseDown || event.type === "click") {
      var row = event.target.getAttribute("data-row"),
          col = event.target.getAttribute("data-col"),
          clickedCell = LifeBoard.board[row][col];
      
      if (clickedCell.status === "alive") {
        clickedCell.status = "dead";
        this.setState({ board: LifeBoard.board });
        return;
      }
      else {
        clickedCell.status = "alive";
        this.setState({ board: LifeBoard.board });
        return;
      }
    } 
  },

  render: function() {
    var tableStyle = {
        borderSpacing: "1px",
        backgroundColor: this.state.gridLineColor,
    }     
    var cells = [];
    for (var row = 0; row < this.state.board.length; row++) {
      cells.push([]);
      for (var col = 0; col < this.state.board[row].length; col++) {
        var bgColor = this.state.board[row][col].status === 'alive' 
                                      ? this.state.primaryColor 
                                      : this.state.secondaryColor;                
        cells[row].push(<td style={{ width: "5px", 
                                     height: "5px", 
                                     backgroundColor: bgColor }}
                          key={col} 
                          data-row={row}
                          data-col={col}
                          onClick={this.cellStatusChange}
                          onMouseOver={this.cellStatusChange}>
                      </td>
        )
      }
    }   

    var lifeGrid = cells.map(function(elem, i) {
      return <tr key={i}>{elem}</tr>
    })

    return (
      <div>
        <Header />  
        <table id="lifeTable" style={tableStyle}>
          <tbody>{lifeGrid}</tbody>
        </table>
        <div id="controls">
          <button className="btn" onClick={this.runSimulation}>Run</button>
          <button className="btn" onClick={this.stopSimulation}>Stop</button>
          <button className="btn" onClick={this.advanceOneGeneration}>Next</button>
          <button className="btn" id="slow" onClick={this.changeSimSpeed}>Slow</button>
          <button className="btn" id="medium" onClick={this.changeSimSpeed}>Medium</button>
          <button className="btn" id="fast" onClick={this.changeSimSpeed}>Fast</button>
        
          <button className="btn" onClick={this.clearBoard}>Reset board</button>
          <button className="btn" onClick={this.randomBoard}>Random board</button>

          <select onChange={this.changeColorScheme}>
            <option value="one">Color scheme #1</option>
            <option value="two">Color scheme #2</option>
            <option value="three">Color scheme #3</option>
            <option value="four">Color scheme #4</option>
          </select>
          <p id="generation">Generation: {this.state.generation}</p>
        </div>                                
      </div>
    )
  }
});

module.exports = Grid;