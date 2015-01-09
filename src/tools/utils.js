define( function() {
	'use strict';

	function makeIs( type ) {
		return function( obj ) {
			return Object.prototype.toString.call( obj ) === '[object ' + type + ']';
		};
	}

	var uids = {};

	var utils = {
		extend: function( target, source ) {
			if ( !this.isObject( source ) && !this.isFunction( source ) ) {
				return target;
			}

			var args, keys, len, i;

			if ( arguments.length > 2 ) {
				args = Array.prototype.splice.call( arguments, 1 );
				len = args.length;

				for ( i = 0; i < len; i++ ) {
					this.extend( target, args[ i ] );
				}

			} else {
				keys = Object.keys( source );
				len = keys.length;

				for ( i = 0; i < len; i++ ) {
					target[ keys[ i ] ] = source[ keys[ i ] ];
				}
			}

			return target;
		},

		inherit: function( target, source ) {
			target.prototype = Object.create( source.prototype, {
				constructor: {
					value: target,
					enumerable: false,
					writable: true,
					configurable: true
				}
			} );
		},

		clone: function( obj ) {
			var clone;

			if ( this.isArray( obj ) ) {
				clone = obj.map( function( value ) {
					return this.clone( value );
				}, this );
			} else if ( this.isObject( obj ) ) {
				clone = {};

				Object.getOwnPropertyNames( obj ).forEach( function( name ) {
					clone[ name ] = this.clone( obj[ name ] );
				}, this );
			} else {
				clone = obj;
			}

			return clone;
		},

		isArray: function( obj ) {
			return Array.isArray( obj );
		},

		isBoolean: function( obj ) {
			return obj === true || obj === false || Object.prototype.toString.call( obj ) === '[object Boolean]';
		},

		isDate: makeIs( 'Date' ),

		isElement: function( obj ) {
			return obj instanceof HTMLElement;
		},

		isFunction: function( obj ) {
			return typeof obj == 'function';
		},

		isNull: function( obj ) {
			return obj === null;
		},

		isNumber: makeIs( 'Number' ),

		isObject: function( obj ) {
			return typeof obj === 'object' && !!obj;
		},

		isRegExp: makeIs( 'RegExp' ),

		isString: makeIs( 'String' ),

		isUndefined: function( obj ) {
			return obj === void 0;
		},

		pick: function( obj, properties ) {
			return Object.keys( obj )
				.reduce( function( output, current ) {
					if ( properties.indexOf( current ) > -1 ) {
						output[ current ] = obj[ current ];
					}

					return output;
				}, {} );
		},

		uid: function( name ) {
			if ( !uids[ name ] ) {
				uids[ name ] = 1;
			}

			return uids[ name ] ++;
		}
	};

	return utils;
} );