import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
} from '@wordpress/block-editor';
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import {
	Spinner,
	withNotices,
	ToolbarButton,
	PanelBody,
	TextareaControl,
} from '@wordpress/components';

function Edit( { attributes, setAttributes, noticeOperations, noticeUI } ) {
	const { name, bio, url, alt, id } = attributes;

	const [ blobURL, setBlobURL ] = useState();

	const onChangeName = ( newName ) => {
		setAttributes( { name: newName } );
	};

	const onChangeBio = ( newBio ) => {
		setAttributes( { bio: newBio } );
	};

	const onSelectImage = ( image ) => {
		if ( ! image || ! image.url ) {
			setAttributes( { url: undefined, id: undefined, alt: '' } );
			return;
		}
		setAttributes( { url: image.url, id: image.id, alt: image.alt } );
	};

	const onSelectURL = ( newUrl ) => {
		setAttributes( {
			url: newUrl,
			id: undefined,
		} );
	};

	const onErrorImage = ( error ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( error );
	};

	const removeImage = () => {
		setAttributes( {
			url: undefined,
			alt: '',
			id: undefined,
		} );
	};

	const onChangeAlt = ( newAlt ) => {
		setAttributes( {
			alt: newAlt,
		} );
	};

	useEffect( () => {
		if ( ! id && isBlobURL( url ) ) {
			setAttributes( {
				url: undefined,
				alt: '',
			} );
		}
	}, [] );

	useEffect( () => {
		if ( isBlobURL( url ) ) {
			setBlobURL( url );
		} else {
			revokeBlobURL( blobURL );
			setBlobURL( undefined );
		}
	}, [ url ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Image settings', 'team-members' ) }>
					{ url && ! isBlobURL( url ) && (
						<TextareaControl
							help={ __(
								'Alternative text describes your image.',
								'team-members'
							) }
							label={ __( 'Alt text', 'team-members' ) }
							onChange={ onChangeAlt }
							value={ alt }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			{ url && (
				<BlockControls group={ 'inline' }>
					<MediaReplaceFlow
						name={ __( 'Replace image', 'team-members' ) }
						mediaURL={ url }
						mediaId={ id }
						onSelect={ onSelectImage }
						onSelectURL={ onSelectURL }
						onError={ onErrorImage }
						accept={ 'image/*' }
						allowedTypes={ [ 'image' ] }
					/>
					<ToolbarButton onClick={ removeImage }>
						{ __( 'Remove image', 'team-members' ) }
					</ToolbarButton>
				</BlockControls>
			) }
			<div { ...useBlockProps() }>
				{ url && (
					<div
						className={ `wp-block-blocks-course-team-member-img ${
							isBlobURL( url ) && 'is-loading'
						}` }
					>
						<img src={ url } alt={ alt } />
						{ isBlobURL( url ) && <Spinner /> }
					</div>
				) }
				<MediaPlaceholder
					icon={ 'admin-users' }
					onSelect={ onSelectImage }
					onSelectURL={ onSelectURL }
					onError={ onErrorImage }
					accept={ 'image/*' }
					allowedTypes={ [ 'image' ] }
					disableMediaButtons={ !! url }
					notices={ noticeUI }
				/>
				<RichText
					placeholder={ __( 'Member name', 'team-members' ) }
					tagName={ 'h4' }
					onChange={ onChangeName }
					value={ name }
					allowedFormats={ [] }
				/>
				<RichText
					placeholder={ __( 'Member Bio', 'team-members' ) }
					tagName={ 'p' }
					onChange={ onChangeBio }
					value={ bio }
					allowedFormats={ [] }
				/>
			</div>
		</>
	);
}

export default withNotices( Edit );
