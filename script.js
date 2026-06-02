const form = document.getElementById('form');
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const messages = document.getElementById('messages');
const chat = document.getElementById('chat');

const AVATARS = {
    bot: 'assets/bot_avatar.png',
    user: 'assets/user_avatar.png'
};

const STATES = {
    START: 'start',
    NAME: 'name',
    NUMBERS: 'numbers',
    OPERATION: 'operation'
};

let state = STATES.START;
let numbers = [];

function addMessage(text, sender) {
    const row = document.createElement('div');
    row.className = 'message ' + sender;

    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = AVATARS[sender];
    avatar.alt = '';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    row.appendChild(avatar);
    row.appendChild(bubble);
    messages.prepend(row);
    chat.scrollTop = 0;
}

function showTyping() {
    const row = document.createElement('div');
    row.className = 'message bot typing';
    row.id = 'typing';

    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = AVATARS.bot;
    avatar.alt = '';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        bubble.appendChild(dot);
    }

    row.appendChild(avatar);
    row.appendChild(bubble);
    messages.prepend(row);
    chat.scrollTop = 0;
}

function removeTyping() {
    const typing = document.getElementById('typing');
    if (typing) {
        typing.remove();
    }
}

function botReply(text) {
    showTyping();
    setTimeout(function () {
        removeTyping();
        addMessage(text, 'bot');
    }, 700);
}

function calculate(values, operation) {
    let result = values[0];
    for (let i = 1; i < values.length; i++) {
        if (operation === '+') {
            result += values[i];
        } else if (operation === '-') {
            result -= values[i];
        } else if (operation === '*') {
            result *= values[i];
        } else if (operation === '/') {
            if (values[i] === 0) {
                return null;
            }
            result /= values[i];
        }
    }
    return result;
}

function handleMessage(text) {
    const value = text.trim();

    if (value === '/stop') {
        state = STATES.START;
        numbers = [];
        botReply('Всего доброго, если хочешь поговорить пиши /start');
        return;
    }

    if (state === STATES.START) {
        if (value === '/start') {
            state = STATES.NAME;
            botReply('Привет, меня зовут Чат-бот, а как зовут тебя?');
        } else {
            botReply('Введите команду /start, для начала общения');
        }
        return;
    }

    if (state === STATES.NAME) {
        if (value.startsWith('/name:')) {
            const name = value.slice('/name:'.length).trim();
            if (name) {
                state = STATES.NUMBERS;
                botReply('Привет ' + name + ', приятно познакомится. Я умею считать, введи числа которые надо посчитать');
            } else {
                botReply('Я не понимаю, введите другую команду!');
            }
        } else {
            botReply('Я не понимаю, введите другую команду!');
        }
        return;
    }

    if (state === STATES.NUMBERS) {
        if (value.startsWith('/number:')) {
            const parts = value.slice('/number:'.length).split(',');
            const parsed = [];
            for (let i = 0; i < parts.length; i++) {
                const num = Number(parts[i].trim());
                if (parts[i].trim() !== '' && !isNaN(num)) {
                    parsed.push(num);
                }
            }
            if (parsed.length >= 2) {
                numbers = parsed;
                state = STATES.OPERATION;
                botReply('Какое действие выполнить? Введите одно из: -, +, *, /');
            } else {
                botReply('Я не понимаю, введите другую команду!');
            }
        } else {
            botReply('Я не понимаю, введите другую команду!');
        }
        return;
    }

    if (state === STATES.OPERATION) {
        if (['+', '-', '*', '/'].includes(value)) {
            const result = calculate(numbers, value);
            if (result === null) {
                botReply('На ноль делить нельзя, введите числа заново командой /number:');
            } else {
                botReply(numbers.join(' ' + value + ' ') + ' = ' + result);
            }
            state = STATES.NUMBERS;
        } else {
            botReply('Я не понимаю, введите другую команду!');
        }
        return;
    }
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
        return;
    }
    addMessage(text, 'user');
    handleMessage(text);
    input.value = '';
    updateButton();
});

function updateButton() {
    if (input.value.trim()) {
        sendButton.disabled = false;
        sendButton.classList.add('active');
    } else {
        sendButton.disabled = true;
        sendButton.classList.remove('active');
    }
}

input.addEventListener('input', updateButton);
