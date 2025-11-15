const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const readline = require('readline');

const tokens = [
  '' // Ganti dengan token OpenRouter Anda, bisa multi dengan '',''
];

const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

async function askAI(question) {
  const validTokens = tokens.filter(token => token && token !== 'token_anda_disini');
  
  if (validTokens.length === 0) {
    throw new Error('Token belum diatur. Silakan ganti token_anda_disini dengan token OpenRouter Anda.');
  }

  for (let i = 0; i < validTokens.length; i++) {
    const token = validTokens[i];
    
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "tngtech/deepseek-r1t2-chimera:free",
          "messages": [
            {
              "role": "user",
              "content": question
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'Tidak ada respons dari AI.';
      } else {
        continue;
      }
      
    } catch (error) {
      continue;
    }
  }
  
  throw new Error('Semua token gagal.');
}

// Buat interface untuk input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chat() {
  console.log('🤖 AI Chat - Ketik "exit" untuk keluar\n');
  
  while (true) {
    const question = await new Promise((resolve) => {
      rl.question('You: ', resolve);
    });

    if (question.toLowerCase() === 'exit') {
      console.log('Selamat tinggal!');
      break;
    }

    if (!question.trim()) {
      console.log('Pertanyaan tidak boleh kosong.\n');
      continue;
    }

    try {
      process.stdout.write('AI: ');
      const answer = await askAI(question);
      console.log(answer + '\n');
    } catch (error) {
      console.log('Error: ' + error.message + '\n');
    }
  }

  rl.close();
}

// Jalankan chat
chat();
