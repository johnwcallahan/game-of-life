var React = require("react");

var Header = React.createClass({
	render: function() {
		return (
			<h1>
				<a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">Conway's Game of Life</a>
			</h1>
		)
	}
});

module.exports = Header;