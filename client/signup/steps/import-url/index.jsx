/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { debounce, defer, flow, get } from 'lodash';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import ButtonGroup from 'components/button-group';
import StepWrapper from 'signup/step-wrapper';
import SignupActions from 'lib/signup/actions';
import FormTextInput from 'components/forms/form-text-input';
import FormInputValidation from 'components/forms/form-input-validation';
import { setNuxUrlInputValue, setValidationMessage } from 'state/importer-nux/actions';
import {
	getNuxUrlInputValue,
	getSiteDetails,
	getUrlInputValidationMessage,
	isUrlInputDisabled,
} from 'state/importer-nux/temp-selectors';

const debug = debugFactory( 'calypso:signup-step-import-url' );

const VALIDATION_INTERVAL = 1200;

const normalizeUrlForImportSource = url => {
	// @TODO sanitize? Prepend https:// ..?
	return url;
};

const isValidUrl = ( value = '' ) =>
	value.match( /^([a-z0-9-_]{1,63}\.)*[a-z0-9-]{1,63}\.[a-z]{2,63}$/i );

class ImportURLStepComponent extends Component {
	componentDidMount() {
		const { queryObject } = this.props;
		const urlFromQueryArg = normalizeUrlForImportSource( get( queryObject, 'url' ) );

		if ( urlFromQueryArg ) {
			this.props.setNuxUrlInputValue( urlFromQueryArg );
			defer( this.checkValidation );
		}
	}

	getValidationMessage( value ) {
		return isValidUrl( value ) ? '' : this.props.translate( 'Please enter a valid URL.' );
	}

	handleAction = importUrl => {
		event.preventDefault();
		debug( { importUrl } );

		SignupActions.submitSignupStep( { stepName: this.props.stepName }, [], {
			importUrl,
			themeSlugWithRepo: 'pub/radcliffe-2',
		} );

		this.props.goToNextStep();
	};

	handleInputChange = event => {
		const value = get( event, 'target.value', '' );

		this.props.setNuxUrlInputValue( value );
		this.checkValidation( value );
	};

	checkValidation( value ) {
		const message = this.getValidationMessage( value );

		// If there is a validation message, show it after
		// a delay so as to give the user chance to finish typing.
		if ( message ) {
			this.debouncedSetValidationMessage( message );
		} else {
			// If the input is good, feedback immediately
			this.debouncedSetValidationMessage.cancel();
			this.setValidationMessage( '' );
		}
	}

	setValidationMessage = message => {
		this.props.setValidationMessage( message );
	};

	debouncedSetValidationMessage = debounce( this.setValidationMessage, VALIDATION_INTERVAL );

	renderContent = () => {
		const { isInputDisabled, urlInputValidationMessage, urlInputValue, translate } = this.props;
		const canContinue = urlInputValue && ! urlInputValidationMessage;

		return (
			<div className="import-url__wrapper">
				<FormTextInput
					placeholder="Enter the URL of your existing site"
					action="Continue"
					label={ translate( 'URL' ) }
					onChange={ this.handleInputChange }
					disabled={ isInputDisabled }
					value={ urlInputValue }
					isError={ urlInputValidationMessage }
				/>
				{ urlInputValidationMessage && (
					<FormInputValidation text={ urlInputValidationMessage } isError />
				) }
				<ButtonGroup>
					<Button onClick={ this.handleAction } primary disabled={ ! canContinue }>
						{ translate( 'Continue' ) }
					</Button>
					<Button>Skip</Button>
				</ButtonGroup>
			</div>
		);
	};

	render() {
		const { flowName, positionInFlow, signupProgress, stepName, translate } = this.props;

		return (
			<StepWrapper
				flowName={ flowName }
				stepName={ stepName }
				positionInFlow={ positionInFlow }
				headerText={ translate( 'Where can we find your old site?' ) }
				subHeaderText={ translate(
					"Enter your site's URL, sometimes called a domain name or site address."
				) }
				signupProgress={ signupProgress }
				stepContent={ this.renderContent() }
			/>
		);
	}
}

export default flow(
	connect(
		state => ( {
			urlInputValue: getNuxUrlInputValue( state ),
			siteDetails: getSiteDetails( state ),
			isInputDisabled: isUrlInputDisabled( state ),
			urlInputValidationMessage: getUrlInputValidationMessage( state ),
		} ),
		{
			setNuxUrlInputValue,
			setValidationMessage,
		}
	),
	localize
)( ImportURLStepComponent );
