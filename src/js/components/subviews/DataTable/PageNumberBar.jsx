// PageNumberBar.jsx
'use strict';

var React = require('react');
var _     = require('lodash');

var Bootstrap   = require('react-bootstrap');

var PageNumberBar = React.createClass({
    render: function() {
        return (
            <Bootstrap.Row>
                <Bootstrap.Col xs={12} className='text-center'>
                    <Bootstrap.ButtonGroup>
                        {_.range(this.props.numPages).map(function(i) {
                            var bsStyle = this.props.pageNum === i ? 'primary' : 'default';
                            return <Bootstrap.Button key={i} data-pagenum={i} bsStyle={bsStyle} onClick={this.props.onPage}>
                                {i + 1}
                            </Bootstrap.Button>;
                        }.bind(this))}
                    </Bootstrap.ButtonGroup>
                </Bootstrap.Col>
            </Bootstrap.Row>
        );
    }
});

module.exports = PageNumberBar;
