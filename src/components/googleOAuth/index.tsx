import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // Correct way for newer versions

const GoogleOAuth = () => {
  const handleLoginSuccess = (response: any) => {
    let data = jwtDecode(response.credential)
    console.log('Login Success:', data);
    // You can send the token to your backend here to verify the user's identity
  };

  const handleLoginFailure = (error: any) => {
    console.log('Login Failure:', error);
  };

  return (
    <GoogleOAuthProvider clientId="410811568267-i3r53unc4ltnsta2mtaem6tc9v9segd7.apps.googleusercontent.com">
      <div className="App">
        <h1>Google Login Example</h1>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
        //   onError={handleLoginFailure} // Corrected handler signature
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleOAuth;
