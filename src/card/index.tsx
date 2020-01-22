import React, { FC, useState } from 'react'
import loadable from '@loadable/component'

import { User } from '../data'
import styles from './style.module.scss'

const Spinner = loadable(() => import('../spinner'))

const UserComponent: FC<User> = ({ first_name, last_name, email, avatar }) => {
	const [isLoaded, setLoaded] = useState(false)
	return (
		<>
			<div className={styles.card}>
				{!isLoaded && <Spinner />}
				<img
					src={avatar}
					alt={`${first_name} ${last_name}`}
					className={styles.avatar}
					onLoad={e => setLoaded(true)}
				/>
				<div className={isLoaded ? styles.container : styles.hidden}>
					<h4>
						<b>
							{first_name} {last_name}
						</b>
					</h4>
					<p>{email}</p>
				</div>
			</div>
		</>
	)
}

export default UserComponent
