module.exports = loginTemplate;

function loginTemplate() {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Login</title>
      </head>
      <body>
        <form action="./login" method="POST">
          <input type="text" name="email" id="email" placeholder="email" />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="password"
          />
          <button>Submit</button>
        </form>
      </body>
    </html>
  `;
}
