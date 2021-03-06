import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Form, Button, Alert } from 'react-bootstrap';

class Register extends React.Component {
	state = {
		username: '',
		password: '',
		phone: '',
		error: false,
		isRemember: false,
	}

	componentDidMount() {
		if (!!localStorage.getItem('rememberUser')) {
			console.log('found credentials')
			let credentials = JSON.parse(localStorage.getItem('rememberUser'))
			this.setState({
				username: credentials.username,
				password: credentials.password
			})
		}
	}

	Register = async (e) => {
		e.preventDefault()
		console.log(this.state)
		let data = {
			username: this.state.username,
			password: this.state.password,
			phone: this.state.phone
		}
		if (data.username == '' || data.password == '' || data.phone == '') {
			this.setState({
				error: true
			})
			return
		}
		if (this.state.isRemember) {
			localStorage.setItem('rememberUser', JSON.stringify(data))
		}
		await fetch('http://localhost:4000/api/auth/register/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((response) => { console.log(response); return response.json(); })
			.then((res) => {
				if (res.response.success) {
					this.setState({
						error: false,
					})
					console.log('Success:', res);
					localStorage.setItem('token', res.token)
					localStorage.setItem('user', JSON.stringify(res.response.data))
					window.location = '/listing'
				} else {
					this.setState({
						error: true,
						errorMessage: res.message
					})
					console.log('Error : ', res)
				}
			})
			.catch((error) => {
				this.setState({
					error: true,
				})
				console.error('Error:', error);
			});
	}
	render() {
		return (
			<Container fluid className='bg-white'>
				<Row>
					<Col md={8} lg={6} style={{ margin: 'auto' }}>
						<div className="login d-flex align-items-center py-5">
							<Container>
								<Row>
									<Col md={9} lg={8} className="mx-auto pl-5 pr-5">
										<h3 className="login-heading mb-4">Join Us!</h3>
										<form onSubmit={this.Register}>
											<div className="form-label-group">
												<Form.Control type="text" id="inputusername" value={this.state.username} onChange={e => this.setState({ username: e.target.value })} placeholder="username" />
												<Form.Label htmlFor="inputusername">Username</Form.Label>
											</div>
											<div className="form-label-group">
												<Form.Control type="text" id="phone" value={this.state.phone} onChange={e => this.setState({ phone: e.target.value })} placeholder="phone" />
												<Form.Label htmlFor="phone">Phone</Form.Label>
											</div>
											<div className="form-label-group">
												<Form.Control type="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} id="inputPassword" placeholder="Password" />
												<Form.Label htmlFor="inputPassword">Password</Form.Label>
											</div>
											<Form.Check
												className='mb-3'
												custom
												type="checkbox"
												id="custom-checkbox"
												label="Remember password"
												onClick={() => this.setState({ isRemember: true })}
											/>
											<button className="btn btn-lg btn-outline-primary btn-block btn-login text-uppercase font-weight-bold mb-2" type="submit" style={{ color: 'white' }}>Sign Up</button>
											<div className="text-center pt-3">
												Already have an account? <Link className="font-weight-bold" to="/login">Sign in</Link>
											</div>
											{this.state.error && <Alert className="alert alert-danger" style={{ marginTop: '5px' }} role="alert">{this.state.errorMessage}</Alert>}
										</form>
									</Col>
								</Row>
							</Container>
						</div>
					</Col>
				</Row>
			</Container>
		);
	}
}


export default Register;