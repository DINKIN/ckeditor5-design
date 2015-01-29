require.config( {
	baseUrl: '../src/',

	paths: {
		lodash: '../lib/lodash',
		mutationSummary: '../lib/mutation-summary'
	},

	shim: {
		mutationSummary: {
			exports: 'MutationSummary'
		}
	}
} );

require( [
	'editor',
	'tools/utils'
], function(
	Editor,
	utils
) {
	'use strict';

	var editor = window.editor = new Editor( '#input' ),
		html = [];

	function formatAttributes( attributes ) {
		if ( utils.isArray( attributes ) ) {
			// retrieve attribute values from the store
			attributes = attributes.map( function( attr ) {
				return editor.editable.document.store.get( attr );
			} );
			attributes.unshift( [] );
			attributes = utils.extend.apply( utils, attributes );
		}

		if ( utils.isObject( attributes ) ) {
			return Object.keys( attributes )
				.map( function( attr ) {
					return attr + ': ' + attributes[ attr ];
				} )
				.join( '<br>' );
		} else {
			return '';
		}
	}

	html = editor.editable.document.data.data.map( function( op ) {
		op = utils.clone( op );

		if ( Array.isArray( op ) ) {
			if ( op[ 0 ] === ' ' ) {
				op[ 0 ] = '_';
				op[ 2 ] = 'whitespace';
			} else {
				op[ 2 ] = 'text';
			}
		} else if ( typeof op == 'string' ) {
			if ( op === ' ' ) {
				op = [ '_' ];
				op[ 2 ] = 'whitespace';
			} else {
				op = [ op ];
				op[ 2 ] = 'text';
			}
		} else {
			op = typeof op == 'object' ? [ op.type, op.attributes ] : [ op ];
			op[ 2 ] = 'tag';
		}

		return op;
	} ).map( function( op, idx ) {
		return [ '<tr>',
			'<td>', idx, '</td>',
			'<td class="', op[ 2 ], '">', op[ 0 ], '</td>',
			'<td>', formatAttributes( op[ 1 ] ), '</td>',
			'<td></td>',
			'</tr>'
		].join( '' );
	} );

	document.querySelector( '#data>tbody' ).innerHTML = html.join( '\n' );

	function buildTree( node, parentElem ) {
		var elem = document.createElement( 'li' );

		elem.innerHTML = node.constructor.type + ' <small>[' + node.length + ']</small>';

		parentElem.appendChild( elem );

		if ( node.children ) {
			var childElem = document.createElement( 'ul' );

			node.children.forEach( function( child ) {
				buildTree( child, childElem );
			} );

			elem.appendChild( childElem );
		}
	}

	buildTree( editor.editable.document.root, document.getElementById( 'tree' ) );
} );