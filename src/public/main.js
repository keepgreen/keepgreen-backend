const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};

window.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('delete-user')
    .addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.querySelector(
        '#delete-user input[type=email]',
      ).value;
      if (!validateEmail(email)) {
        document
          .querySelector('#delete-user input[type=email]')
          .classList.add('border-red-400');
        document.getElementById('error-message').innerHTML = 'Email invalid.';
        return;
      }

      document.querySelector('#delete-user button').disabled = true;
      document.getElementById('loading').classList.remove('hidden');

      (async () => {
        const rawResponse = await fetch('/user/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        await rawResponse.json();
        document.getElementById('loading').classList.add('hidden');
        document.querySelector('#delete-my-acc h1').innerHTML = 'Success';
        document.querySelector('#delete-my-acc p').innerHTML =
          "Great, we've just sent you a confirmation email. Please check your inbox to validate your request.";
        document.getElementById('delete-user').classList.add('hidden');
      })();
    });
  document.getElementById('email').addEventListener('input', function () {
    document
      .querySelector('#delete-user input[type=email]')
      .classList.remove('border-red-400');
    document.getElementById('error-message').innerHTML = '';
  });
});
