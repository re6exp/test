import React, { useState, useCallback, useRef, ChangeEvent } from 'react'
import axios from 'axios'
import loadable from '@loadable/component'

import { Query, User } from '../data'
import styles from './styles.module.scss'

const UserComponent = loadable(() => import('../card'))

const getUsers = async (guery: Query) => {
	const { data } = await axios.post('/users', guery)
	return data as User[]
}

const validate: (
	e: React.FormEvent<HTMLInputElement>
) => (
	errorSpan: React.RefObject<HTMLSpanElement>,
	submitButton: React.RefObject<HTMLButtonElement>,
	callback?: () => void
) => void = event => (errorSpan, submitButton, callback) => {
	if (event.currentTarget.validity.valid) {
		if (
			errorSpan &&
			errorSpan.current &&
			submitButton &&
			submitButton.current
		) {
			errorSpan.current.innerHTML = ''
			submitButton.current.disabled = false
		}
	} else {
		if (
			errorSpan &&
			errorSpan.current &&
			submitButton &&
			submitButton.current
		) {
			errorSpan.current.innerHTML = `Allowed symbols are only letters of one of the languages (Russian or English).`
			submitButton.current.disabled = true
		}
	}
	if (callback !== undefined) {
		callback()
	}
}

const allowedExpression = `^(([A-Za-z]+)|([\u0400-\u04ff]+))$`

const FindForm = () => {
	const formRef = useRef<HTMLFormElement>(null)
	const submitButtonRef = useRef<HTMLButtonElement>(null)
	const errorFirstNameSpan = useRef<HTMLSpanElement>(null)
	const errorLastNameSpan = useRef<HTMLSpanElement>(null)

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [users, setUsers] = useState(undefined as undefined | User[])

	const onSubmit = useCallback(
		async (event: { preventDefault: () => void }) => {
			event.preventDefault()

			const query: Query = {
				first_name: firstName ? firstName : undefined,
				last_name: lastName ? lastName : undefined
			}

			if (
				query.first_name !== undefined ||
				query.last_name !== undefined
			) {
				const data = await getUsers(query)
				setUsers(data)
			} else {
				setUsers([])
			}
		},
		[firstName, lastName]
	)

	return (
		<>
			<form ref={formRef}>
				<div>
					<label htmlFor='firstName'>First Name:</label>
					<div>
						<input
							id='firstName'
							type='text'
							value={firstName}
							itemType=''
							pattern={allowedExpression}
							onInput={e =>
								validate(e)(errorFirstNameSpan, submitButtonRef)
							}
							onChange={e => setFirstName(e.target.value)}
						/>
						<span
							ref={errorFirstNameSpan}
							className={styles.error}
						/>
					</div>
				</div>
				<div>
					<label htmlFor='lastName'>Last Name:</label>
					<div>
						<input
							id='lastName'
							type='text'
							value={lastName}
							pattern={allowedExpression}
							onInput={e =>
								validate(e)(errorLastNameSpan, submitButtonRef)
							}
							onChange={e => setLastName(e.target.value)}
						/>
						<span
							ref={errorLastNameSpan}
							className={styles.error}
						/>
					</div>
				</div>
				<div>
					<button
						ref={submitButtonRef}
						type='submit'
						value='Find'
						onClick={onSubmit}
					>
						Search
					</button>
				</div>
			</form>

			{users &&
				((users.length > 0 && (
					<div className={styles.cardContainer}>
						{users.map(u => (
							<UserComponent {...u} key={u.id} />
						))}
					</div>
				)) || <div className={styles.message}>No results</div>)}
		</>
	)
}

export default FindForm
