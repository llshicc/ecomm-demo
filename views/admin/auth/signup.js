module.exports = signupTemplate;

function signupTemplate({ email }) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sign Up</title>
      </head>
      <body>
        ${email}
        <form action="./signup" method="POST">
          <input type="text" name="email" id="email" placeholder="Email" />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
          />
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            placeholder="Confirm password"
          />
          <button>Submit</button>
        </form>
      </body>
    </html>`;
}
