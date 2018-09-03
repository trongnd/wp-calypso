/** @format */
/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import DocumentHead from 'components/data/document-head';
import MobileBackToSidebar from 'components/mobile-back-to-sidebar';
import ReaderMain from 'components/reader-main';
import { requestCommunityEvents } from 'state/community-events/actions';

// TODO - maybe add item for this section in Reader to wordpress-com.js

class CommunityEvents extends React.Component {
	componentDidMount() {
		this.props.requestCommunityEvents();
	}

	render() {
		const { loading, events, error, translate } = this.props;

		if ( loading ) {
			return <div>Loading...</div>;
		}

		if ( error ) {
			return <div>Error! { error }</div>;
		}

		return (
			<ReaderMain className="community-events">
				<DocumentHead title={ 'Community Events' } />
				<MobileBackToSidebar>
					<h1>{ translate( 'Streams' ) }</h1>
				</MobileBackToSidebar>
				<h2 className="community-events__header">{ translate( 'Community Events' ) }</h2>
				{ events.map( ( event, index ) => {
					return <div key={ index }>{ event.title }</div>;
				} ) }
			</ReaderMain>
		);
	}
}

const mapStateToProps = state => ( {
	events: state.communityEvents.events || [],
	loading: state.communityEvents.isLoading,
	error: state.communityEvents.error,
} );

const mapDispatchToProps = {
	requestCommunityEvents,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( localize( CommunityEvents ) );
