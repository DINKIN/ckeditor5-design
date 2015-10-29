/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

CKEDITOR.define( 'plugin!creator-classic/controller', [
	'ui/controller',
	'plugin!ui-library/framededitableview',
	'plugin!creator-classic/editorchromeview',
	'plugin!creator-classic/view',
	'plugin!toolbar'
], function( Controller, FramedEditableView, EditorChromeView, ClassicCreatorView ) {
	class ClassicCreatorController extends Controller {
		constructor( model ) {
			super( model );

			this.view = new ClassicCreatorView( model );
		}

		init() {
			var editor = this.model.editor;
			editor.regions = this.view.regions;

			return super.init()
				.then( this.injectChrome.bind( this ) )
				.then( this.injectToolbar.bind( this ) )
				.then( this.injectEditable.bind( this ) )
				.then( this.initEditable.bind( this ) );
		}

		injectChrome() {
			var editor = this.model.editor;
			var editorChrome = new Controller( {}, new EditorChromeView() );

			return this.append( editorChrome, 'chrome' )
				.then( () => {
					editor.element.parentNode.insertBefore(
						editorChrome.view.el,
						editor.element
					);

					return editorChrome;
				} );
		}

		injectToolbar( editorChrome ) {
			var editor = this.model.editor;
			var toolbarPlugin = editor.plugins.get( 'toolbar' );

			return Promise.resolve( toolbarPlugin.getController() )
				.then( toolbar => {
					editorChrome.append( toolbar, 'top' );

					return editorChrome;
				} );
		}

		injectEditable( editorChrome ) {
			return Promise.resolve( new Controller( {}, new FramedEditableView() ) )
				.then( framedEditable => {
					return editorChrome.append( framedEditable, 'editable' );
				} );
		}

		initEditable( framedEditable ) {
			var iframe = framedEditable.view.el;
			iframe.contentDocument.body.contentEditable = true;
		}
	}

	return ClassicCreatorController;
} );