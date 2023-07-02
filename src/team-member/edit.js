import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes } ) {
	const { name, bio } = attributes;

	const onChangeName = ( newName ) => {
		setAttributes( { name: newName } );
	};

	const onChangeBio = ( newBio ) => {
		setAttributes( { bio: newBio } );
	};

	return (
		<div { ...useBlockProps() }>
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
	);
}
