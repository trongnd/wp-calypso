/**
 * External dependencies
 *
 * @format
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

/**
 * Internal dependencies
 */
import getCurrentLocaleSlug from 'state/selectors/get-current-locale-slug';

const momentLoaders = new Map();

function loadMomentLocale( locale ) {
	const existingLoader = momentLoaders.get( locale );
	if ( existingLoader ) {
		return existingLoader;
	}

	const newLoader = import( /* webpackChunkName: "moment-locale-[request]", webpackInclude: /\.js$/ */ `moment/locale/${ locale }` )
		.then( () => {
			moment.locale( locale );
		} )
		.finally( () => {
			momentLoaders.delete( locale );
		} );
	momentLoaders.set( locale, newLoader );
	return newLoader;
}

function getDisplayName( WrappedComponent ) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function( WrappedComponent ) {
	class WithLocalizedMoment extends Component {
		static displayName = `WithLocalizedMoment(${ getDisplayName( WrappedComponent ) })`;

		loadLocale() {
			if ( this.props.locale === moment.locale() ) {
				return;
			}
			if ( this.props.locale !== 'en' ) {
				const loadingLocale = this.props.locale;
				loadMomentLocale( loadingLocale ).then( () => {
					if ( this._mounted && this.props.locale === loadingLocale ) {
						this.forceUpdate();
					}
				} );
			} else {
				moment.locale( 'en' );
				this.forceUpdate();
			}
		}

		componentDidMount() {
			this._mounted = true;
			this.loadLocale();
		}

		componentDidUpdate() {
			this.loadLocale();
		}

		componentWillUnmount() {
			this._mounted = false;
		}

		render() {
			return <WrappedComponent moment={ moment } { ...this.props } />;
		}
	}

	return connect( state => ( {
		locale: getCurrentLocaleSlug( state ),
	} ) )( WithLocalizedMoment );
}
