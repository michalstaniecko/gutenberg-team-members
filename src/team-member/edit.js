import { useEffect, useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { usePrevious } from '@wordpress/compose';
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import {
	Spinner,
	withNotices,
	ToolbarButton,
	PanelBody,
	TextareaControl,
	SelectControl,
} from '@wordpress/components';

function Edit( { attributes, setAttributes, noticeOperations, noticeUI } ) {
	const { name, bio, url, alt, id } = attributes;

	const [ blobURL, setBlobURL ] = useState();

	const prevUrl = usePrevious( url );

	const titleRef = useRef();

	const imageObject = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' );
			return id ? getMedia( id ) : null;
		},
		[ id ]
	);

	const imageSizes = useSelect( ( select ) => {
		return select( blockEditorStore ).getSettings().imageSizes;
	}, [] );

	const getImageSizeOptions = () => {
		if ( ! imageObject ) return [];

		const { sizes } = imageObject.media_details;

		const options = Object.keys( sizes )
			.map( ( sizeSlug ) => {
				const imageSize = imageSizes.find(
					( { slug } ) => slug === sizeSlug
				);
				if ( ! imageSize ) return [];
				return [
					{
						label: imageSize.name,
						value: sizes[ sizeSlug ].source_url,
					},
				];
			} )
			.flat();

		return options;
	};

	getImageSizeOptions();

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

	const onChangeSize = ( newUrl ) => {
		setAttributes( { url: newUrl } );
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

	useEffect( () => {
		if ( url && ! prevUrl ) titleRef.current.focus();
	}, [ url, prevUrl ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Image settings', 'team-members' ) }>
					{ id && (
						<SelectControl
							label={ __( 'Image size', 'team-members' ) }
							options={ getImageSizeOptions() }
							value={ url }
							onChange={ onChangeSize }
						/>
					) }
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
					ref={ titleRef }
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
