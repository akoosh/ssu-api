// TableHeader.jsx
'use strict';

var React = require('react');
var _     = require('lodash');

var Bootstrap   = require('react-bootstrap');

var TableHeader = React.createClass({
    render: function() {
        var headings = this.props.columns.map(function(column, i) {
            var bsStyle = this.props.simple ? '' : 'clickable';

            if (column.key === this.props.sortKey) {
                bsStyle += ' active';

                switch (this.props.sortOrder) {
                    case -1:
                        bsStyle += ' header-sort-desc';
                        break;
                    case 1:
                        bsStyle += ' header-sort-asc';
                        break;
                    default:
                        break;
                }
            }

            return (
                <th key={i} className={bsStyle} data-key={column.key} onClick={this.props.onHeaderClick}>
                    {column.label}
                </th>
            );
        }.bind(this));

        return (
            <thead>
                <tr>
                    {headings}
                </tr>
            </thead>
        );
    }
});

module.exports = TableHeader;
