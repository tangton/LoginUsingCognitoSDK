import { Fragment, Component } from 'react';
import * as AWS from 'aws-sdk/global';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

type Props = {

}

type State = {
    isSubmitting: boolean;
    errorMessages: string[];
    email: string;
    password: string;
}

class Login extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = { errorMessages: new Array<string>(), isSubmitting: false, email: '', password: '' };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ password: e.target.value });
    }

    componentDidMount(): void {
    }

    handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        if (!this.state.isSubmitting) {
            this.setState({ isSubmitting: true });

            let errorMessages = new Array<string>();
            if (!this.state.email) {
                errorMessages.push("Please enter your email address.")
            }
            if (!this.state.password) {
                errorMessages.push("Please enter your password.")
            }

            if (errorMessages.length == 0) {
                var authenticationData = {
                    Username: this.state.email,
                    Password: this.state.password,
                };
                var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
                    authenticationData
                );
                var poolData = {
                    UserPoolId: import.meta.env.PUBLIC_USERPOOL,
                    ClientId: import.meta.env.PUBLIC_CLIENT_ID,
                };
                var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
                var userData = {
                    Username: this.state.email,
                    Pool: userPool,
                };
                var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
                cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: (result: AmazonCognitoIdentity.CognitoUserSession) => {
                        alert('success')
                    },
                    onFailure: (err: any) => {
                        this.setState({ errorMessages: [err.message] });
                        this.setState({ isSubmitting: false });
                    },
                });
            }
            else {
                this.setState({ errorMessages: errorMessages });
                this.setState({ isSubmitting: false });
            }
        }
        e.preventDefault();
    }

    render() {
        return (
            <div className="block">
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group mb-6">
                        <label htmlFor="inputEmail" className="form-label inline-block mb-2 text-gray-700">Email address</label>
                        <input type="email" className="form-control demo-input" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" value={this.state.email} onChange={this.handleEmailChange} />
                    </div>
                    <div className="form-group mb-6">
                        <label htmlFor="inputPassword" className="form-label inline-block mb-2 text-gray-700">Password</label>
                        <input type="password" className="form-control demo-input" id="inputPassword" placeholder="Password" onChange={this.handlePasswordChange} />
                    </div>
                    {this.state.errorMessages &&
                        this.state.errorMessages.map(x =>
                            <div key={x} className="form-group mb-2 text-red-700">
                                {x}
                            </div>
                        )
                    }
                    <button type="submit" className="w-full demo-button">
                        {this.state.isSubmitting ?
                            <div className="flex items-center justify-center space-x-2">
                                <div className="spinner-border animate-spin inline-block w-4 h-4 border-1 rounded-full" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div> :
                            "Sign in"
                        }
                    </button>
                </form>
            </div>
        );
    }
}

export default Login;