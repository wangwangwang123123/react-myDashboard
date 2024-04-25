import React from 'react'
import CustomAvatar from '../custom-avator';




type Props = {
  avatarUrl?: string;
  name: string
  shape?: 'circle' | 'square'
}
const SelectOptionWithAvatar = ({avatarUrl, name, shape} :Props) => {
  return (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			gap: '8px',
		}}
	>

		<CustomAvatar shape={shape} name={name} src={avatarUrl}/>
	</div>
  )
}

export default SelectOptionWithAvatar