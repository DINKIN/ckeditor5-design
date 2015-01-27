define( [
	'node',
	'tools/utils'
], function(
	Node,
	utils
) {
	'use strict';

	function Branch( op, children ) {
		Node.apply( this, arguments );

		this.children = Array.isArray( children ) ? children : [];

		this.children.forEach( function( child ) {
			child.parent = this;
		}, this );
	}


	// inherit statics
	utils.extend( Branch, Node );
	// inherit prototype
	utils.inherit( Branch, Node );

	utils.extend( Branch.prototype, {
		append: function( child ) {
			this.children.push( child );
			child.setParent( this );
			child.setRoot( this.root );
		},

		hasChildren: function() {
			return !!this.children.length;
		},

		pop: function() {
			if ( this.children.length ) {
				var idx = this.children.length - 1;
				var child = this.children[ idx ];

				this.splice( idx, 1 );

				return child;
			}
		},

		push: function( child ) {
			this.splice( this.children.length - 1, 0, child );

			return this.children.length;
		},

		shift: function() {
			if ( this.children.length ) {
				var child = this.children[ 0 ];

				this.splice( 0, 1 );

				return child;
			}
		},

		splice: function() {
			var removed = this.children.splice.apply( this.children, arguments ),
				removedLength = 0,
				addedLength = 0;

			// calculate the overal length of removed items
			removed.forEach( function( item ) {
				removedLength += item.length;
				item.parent = null;
				item.root = null;
			} );

			// calculate the overal length of added items
			if ( arguments.length > 2 ) {
				[].slice.call( arguments, 2 ).forEach( function( item ) {
					addedLength += item.length;
					item.parent = this;
					item.root = this.root;
				}, this );
			}

			// update the length
			this.adjustLength( addedLength - removedLength );
		},

		unshift: function( child ) {
			this.splice( 0, 0, child );

			return this.children.length();
		}
	} );

	return Branch;
} );