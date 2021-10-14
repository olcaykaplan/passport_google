import React from 'react'

 const GoogleButton = () => {
    const redirectToGoogleSSO = async () => {
        let timer: NodeJS.Timeout | null = null;
        const googleLoginURL = "https://google-passportjs.herokuapp.com/api/v1/auth/google"
        const newWindow = window.open(
          googleLoginURL,
          "_parent"
        );
      
        if (newWindow) {
          timer = setInterval(() => {
            if (newWindow.closed) {
              if (timer) clearInterval(timer);
            }
          }, 500);
        }
      };
    return (
        <button onClick={redirectToGoogleSSO} style={{height:"45px", width:"170px", cursor:"pointer"}}>
          <b>Google Login Button</b>
        </button>
    )
}

export default GoogleButton
