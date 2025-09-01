// src/test.js

console.log("Olá do test.js! Se vir isto na consola, o Vite está a servir ficheiros.");

// Vamos escrever diretamente no HTML para ter a certeza
const rootDiv = document.getElementById('root');
if (rootDiv) {
  rootDiv.innerHTML = '<h1 style="color: black; font-size: 24px; text-align: center; padding-top: 50px;">Vite serviu este ficheiro com sucesso!</h1>';
} else {
  console.error("Erro crítico: O div com id 'root' não foi encontrado no index.html!");
}