/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import { debounce, flow, get } from 'lodash';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import ButtonGroup from 'components/button-group';
import StepWrapper from 'signup/step-wrapper';
import SignupActions from 'lib/signup/actions';
import FormTextInputWithAction from 'components/forms/form-text-input-with-action';
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

class ImportURLStepComponent extends Component {
	componentDidMount() {
		const { queryObject } = this.props;
		const urlFromQueryArg = normalizeUrlForImportSource( get( queryObject, 'url' ) );

		if ( urlFromQueryArg ) {
			this.setValidationMessage( urlFromQueryArg );
		}
	}

	getValidationMessage() {
		const { urlInputValue, translate } = this.props;

		if ( ! urlInputValue.match( /^([a-z0-9-_]{1,63}\.)*[a-z0-9-]{1,63}\.[a-z]{2,63}$/i ) ) {
			return translate( 'Please enter a valid URL.' );
		}

		return '';
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

	handleInputChange = value => {
		this.props.setNuxUrlInputValue( value );
		this.debouncedSetValidationMessage( value );
	};

	setValidationMessage = () => {
		const validationMessage = this.getValidationMessage( this.props.urlInputValue );
		this.props.setValidationMessage( validationMessage );
	};

	debouncedSetValidationMessage = debounce( this.setValidationMessage, VALIDATION_INTERVAL );

	renderContent = () => {
		const { isInputDisabled, urlInputValidationMessage, urlInputValue, translate } = this.props;

		return (
			<div className="import-url__wrapper">
				<FormTextInputWithAction
					placeholder="Enter the URL of your existing site"
					action="Continue"
					onAction={ this.handleAction }
					label={ translate( 'URL' ) }
					onChange={ this.handleInputChange }
					disabled={ isInputDisabled }
					value={ urlInputValue }
				/>
				{ urlInputValidationMessage && (
					<FormInputValidation text={ urlInputValidationMessage } isError />
				) }
				<ButtonGroup>
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
