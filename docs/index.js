const main = async () => {
  const invert = localStorage.getItem('invert') === 'true';
  let data = JSON.parse(localStorage.getItem('data'));
  if (!data) {
    const res = await fetch('data/vn/numbers.json');
    data = await res.json();
    if (invert) {
      data = Object.entries(data).reduce((o, [k, v]) => ({ ...o, [v]: k }), {});
    }
    localStorage.setItem('data', JSON.stringify(data));
    localStorage.setItem('invert', !invert);
  }

  const questions = Object.keys(data);
  const answers = Object.values(data);

  const m = document.querySelector('main');

  let index = m.getAttribute('data-id');
  if (!index) {
    index = Math.floor(Math.random() * questions.length);
    m.setAttribute('data-id', index);
  }

  const question = document.querySelector('#question');
  question.querySelector('p').innerText = questions[index];
  question.classList.add('show');

  const answer = document.querySelector('#answer');
  answer.querySelector('p').innerText = answers[index];

  m.onclick = (e) => {
    e.preventDefault();

    question.classList.remove('show');
    answer.classList.add('show');
  };

  const nav = document.querySelectorAll('nav a');
  nav.forEach((el) => {
    el.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (el.id === 'correct') {
        delete data[questions[index]];
        if (Object.keys(data).length !== 0) {
          localStorage.setItem('data', JSON.stringify(data));
        } else {
          localStorage.removeItem('data');
        }
      }

      m.removeAttribute('data-id');

      answer.classList.remove('show');
      question.classList.add('show');

      main();
    };
  });
}

(main)();
