document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme detection
    initializeThemeDetection();

    // Initialize language search functionality
    initializeLanguageSearch('left');
    initializeLanguageSearch('right');

    // Initialize user selection
    initializeUserSelection();

    // Initialize clear chat functionality
    document.getElementById('clearChatBtn').addEventListener('click', clearChat);

    // Restore saved language selections
    const savedLeftLang = localStorage.getItem('leftLanguage');
    const savedRightLang = localStorage.getItem('rightLanguage');
    
    if (savedLeftLang) {
        selectLanguage('left', savedLeftLang);
    }
    if (savedRightLang) {
        selectLanguage('right', savedRightLang);
    }

    // Add enter key listener to message input
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add language selection handlers for both dropdowns
    document.querySelectorAll('#leftLangDropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            selectLanguage('left', lang);
            updatePlaceholder();
        });
    });

    document.querySelectorAll('#rightLangDropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            selectLanguage('right', lang);
            updatePlaceholder();
        });
    });
});

// Initialize theme detection and handling
function initializeThemeDetection() {
    // Watch for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial theme setup
    handleThemeChange(mediaQuery);
    
    // Listen for theme changes
    mediaQuery.addEventListener('change', handleThemeChange);
}

// Handle theme changes
function handleThemeChange(e) {
    // The CSS handles most of the theme changes through CSS variables
    // This function is here for any additional JavaScript-based theme adjustments if needed
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
}

// Initialize user selection functionality
function initializeUserSelection() {
    const user1Btn = document.getElementById('user1Btn');
    const user2Btn = document.getElementById('user2Btn');
    
    // Set default active user
    user1Btn.classList.add('active');
    
    user1Btn.addEventListener('click', function() {
        user2Btn.classList.remove('active');
        user1Btn.classList.add('active');
        updatePlaceholder();
    });
    
    user2Btn.addEventListener('click', function() {
        user1Btn.classList.remove('active');
        user2Btn.classList.add('active');
        updatePlaceholder();
    });
}

// Predefined placeholder translations
const placeholderTranslations = {
    "Afrikaans": "Tik jou boodskap...",
    "Albanian": "Shkruaj mesazhin tënd...",
    "Amharic": "መልእክትዎን ይጻፉ...",
    "Arabic": "اكتب رسالتك...",
    "Armenian": "Գրեք ձեր հաղորդագրությունը...",
    "Assamese": "আপোনাৰ বাৰ্তা লিখক...",
    "Azerbaijani": "Mesajınızı yazın...",
    "Bangla": "আপনার বার্তা লিখুন...",
    "Basque": "Idatzi zure mezua...",
    "Belarusian": "Напішыце сваё паведамленне...",
    "Bosnian": "Napišite svoju poruku...",
    "Bulgarian": "Напишете вашето съобщение...",
    "Catalan": "Escriu el teu missatge...",
    "Cebuano": "Isulat ang imong mensahe...",
    "Chinese": "输入您的信息...",
    "Croatian": "Upišite svoju poruku...",
    "Czech": "Napište svou zprávu...",
    "Danish": "Skriv din besked...",
    "Dutch": "Typ je bericht...",
    "English": "Type your message...",
    "Esperanto": "Tajpu vian mesaĝon...",
    "Estonian": "Kirjuta oma sõnum...",
    "Finnish": "Kirjoita viestisi...",
    "French": "Tapez votre message...",
    "Galician": "Escribe a túa mensaxe...",
    "Georgian": "დაწერეთ თქვენი შეტყობინება...",
    "German": "Geben Sie Ihre Nachricht ein...",
    "Greek": "Πληκτρολογήστε το μήνυμά σας...",
    "Gujarati": "તમારો સંદેશ લખો...",
    "Haitian Creole": "Tape mesaj ou a...",
    "Hausa": "Rubuta sakonka...",
    "Hebrew": "כתוב את ההודעה שלך...",
    "Hindi": "अपना संदेश लिखें...",
    "Hmong": "Sau koj cov lus...",
    "Hungarian": "Írja be az üzenetét...",
    "Icelandic": "Skrifaðu skilaboðin þín...",
    "Igbo": "Dee ozi gị...",
    "Indonesian": "Ketik pesan Anda...",
    "Irish": "Scríobh do theachtaireacht...",
    "Italian": "Scrivi il tuo messaggio...",
    "Japanese": "メッセージを入力...",
    "Javanese": "Ketik pesen sampeyan...",
    "Kannada": "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಬರೆಯಿರಿ...",
    "Kazakh": "Хабарыңызды жазыңыз...",
    "Khmer": "សរសេរសាររបស់អ្នក...",
    "Korean": "메시지를 입력하세요...",
    "Kurdish": "Peyama xwe binivîse...",
    "Kyrgyz": "Кабарыңызды жазыңыз...",
    "Lao": "ຂຽນຂໍ້ຄວາມຂອງເຈົ້າ...",
    "Latin": "Scribe nuntium tuum...",
    "Latvian": "Rakstiet savu ziņojumu...",
    "Lithuanian": "Įveskite savo pranešimą...",
    "Luxembourgish": "Gitt Äre Message an...",
    "Macedonian": "Напишете ја вашата порака...",
    "Malagasy": "Soraty ny hafatrao...",
    "Malay": "Taip mesej anda...",
    "Malayalam": "നിങ്ങളുടെ സന്ദേശം എഴുതുക...",
    "Maltese": "Ikteb il-messaġġ tiegħek...",
    "Maori": "Tuhia tāu karere...",
    "Marathi": "तुमचा संदेश लिहा...",
    "Mongolian": "Мессежээ бичнэ үү...",
    "Myanmar (Burmese)": "မက်ဆေ့ချ် ရိုက်ထည့်ပါ...",
    "Nepali": "आफ्नो सन्देश लेख्नुहोस्...",
    "Norwegian": "Skriv meldingen din...",
    "Odia (Oriya)": "ଆପଣଙ୍କ ବାର୍ତ୍ତା ଲେଖନ୍ତୁ...",
    "Pashto": "خپل پیغام ولیکئ...",
    "Persian": "پیام خود را بنویسید...",
    "Polish": "Wpisz swoją wiadomość...",
    "Portuguese": "Escreva a sua mensagem...",
    "Punjabi": "ਆਪਣਾ ਸੁਨੇਹਾ ਲਿਖੋ...",
    "Romanian": "Scrieți mesajul dvs...",
    "Russian": "Введите ваше сообщение...",
    "Samoan": "Tusi lau feau...",
    "Scots Gaelic": "Sgrìobh do theachdaireachd...",
    "Serbian": "Упишите своју поруку...",
    "Sesotho": "Ngola molaetsa oa hau...",
    "Shona": "Nyora meseji yako...",
    "Sindhi": "پنھنجو پيغام لکو...",
    "Sinhala": "ඔබගේ පණිවිඩය ලියන්න...",
    "Slovak": "Napíšte svoju správu...",
    "Slovenian": "Vnesite svoje sporočilo...",
    "Somali": "Qor fariintaada...",
    "Spanish": "Escribe tu mensaje...",
    "Sundanese": "Tulis pesen anjeun...",
    "Swahili": "Andika ujumbe wako...",
    "Swedish": "Skriv ditt meddelande...",
    "Tagalog": "I-type ang iyong mensahe...",
    "Tajik": "Паёми худро нависед...",
    "Tamil": "உங்கள் செய்தியை உள்ளிடவும்...",
    "Telugu": "మీ సందేశాన్ని టైప్ చేయండి...",
    "Thai": "พิมพ์ข้อความของคุณ...",
    "Turkish": "Mesajınızı yazın...",
    "Ukrainian": "Введіть ваше повідомлення...",
    "Urdu": "اپنا پیغام لکھیں...",
    "Uyghur": "خېتىڭىزنى يېزىڭ...",
    "Uzbek": "Xabaringizni yozing...",
    "Vietnamese": "Nhập tin nhắn của bạn...",
    "Welsh": "Teipiwch eich neges...",
    "Xhosa": "Chwetheza umyalezo wakho...",
    "Yiddish": "שרייב דיין מעסעדזש...",
    "Yoruba": "Kọ ifiranṣẹ rẹ...",
    "Zulu": "Thayipha umyalezo wakho..."
};

// Update input placeholder based on active user and language
function updatePlaceholder() {
    const messageInput = document.getElementById('messageInput');
    const activeUser = document.querySelector('.user-btn.active');
    const userNumber = activeUser.getAttribute('data-user');
    
    let lang;
    if (userNumber === '1') {
        lang = document.getElementById('leftLangBtn').textContent.trim().replace('🌐 ', '');
    } else {
        lang = document.getElementById('rightLangBtn').textContent.trim().replace('🌐 ', '');
    }
    
    // Use the predefined translation or fallback to English
    messageInput.placeholder = placeholderTranslations[lang] || placeholderTranslations["English"];
}

function initializeLanguageSearch(side) {
    const searchInput = document.getElementById(`${side}LangSearch`);
    const languageList = document.getElementById(`${side}LangList`);
    const items = languageList.getElementsByClassName('dropdown-item');

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        Array.from(items).forEach(item => {
            const lang = item.getAttribute('data-lang').toLowerCase();
            if (lang.includes(query)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

function selectLanguage(side, lang) {
    // Update button text
    document.getElementById(`${side}LangBtn`).innerHTML = `<i class="fas fa-globe"></i> ${lang}`;
    
    // Update active state in dropdown
    const dropdown = document.getElementById(`${side}LangList`);
    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-lang') === lang) {
            item.classList.add('active');
        }
    });

    // Save selection to localStorage
    localStorage.setItem(`${side}Language`, lang);
    
    // Update placeholder if needed
    updatePlaceholder();
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    const activeUser = document.querySelector('.user-btn.active');
    const userNumber = activeUser.getAttribute('data-user');
    
    let sourceLang, targetLang;
    if (userNumber === '1') {
        sourceLang = document.getElementById('leftLangBtn').textContent.trim().replace('🌐 ', '').replace('', '');
        targetLang = document.getElementById('rightLangBtn').textContent.trim().replace('🌐 ', '').replace('', '');
    } else {
        sourceLang = document.getElementById('rightLangBtn').textContent.trim().replace('🌐 ', '').replace('', '');
        targetLang = document.getElementById('leftLangBtn').textContent.trim().replace('🌐 ', '').replace('', '');
    }
    
    // Debug log
    console.log('Translation request:', {
        text: text,
        sourceLang: sourceLang,
        targetLang: targetLang,
        userNumber: userNumber
    });

    // Add original message to chat
    addMessageToChat(text, null, userNumber === '1');
    input.value = '';

    try {
        // Get translation
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                source_lang: sourceLang,
                target_lang: targetLang
            })
        });

        // Log the raw response
        console.log('Raw response:', await response.clone().text());

        const data = await response.json();
        if (data.error) {
            console.error('Server error:', data.error);
            throw new Error(data.error);
        }

        // Add translated message
        addMessageToChat(data.translation, text, userNumber === '2');
    } catch (error) {
        console.error('Translation error details:', {
            error: error.message,
            stack: error.stack
        });
        alert('Error translating message: ' + error.message);
    }
}

function addMessageToChat(text, originalText, isSent) {
    const chatContainer = document.getElementById('mainChat');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = text;
    
    messageDiv.appendChild(messageContent);
    
    if (originalText) {
        const translationDiv = document.createElement('div');
        translationDiv.className = 'translation';
        translationDiv.textContent = `Original: ${originalText}`;
        messageDiv.appendChild(translationDiv);
    }
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Clear all chat messages
function clearChat() {
    const chatContainer = document.getElementById('mainChat');
    if (chatContainer) {
        chatContainer.innerHTML = '';
    }
} 