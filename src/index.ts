import { catchSuspiciousMessage } from "./services/api";
import { Whatsapp, Message, Contact, Chat } from "venom-bot";
import { formatPhoneNumber } from "./utils/formatPhoneNumber";

const venom = require("venom-bot");

// const CLIENT_NUMBER = "5511973977593";
const CLIENT_NUMBER = "558594002572";
// const CLIENT_NAME = "Junior";
const CLIENT_NAME = "Willamy";

venom
  .create(
    "sessionName", // Nome da sessão
    (
      base64Qrimg: string,
      asciiQR: string,
      attempts: string,
      urlCode: string
    ) => {
      console.log(asciiQR); // QR code no console (opcional)
    },
    (statusSession: string, session: string) => {
      console.log("Status da sessão: ", statusSession); // Retorna o status da sessão (opcional)
      console.log("Nome da sessão: ", session);
    },
    {
      folderNameToken: "tokens", // Pasta para armazenar tokens
      mkdirFolderToken: "", // Não criar pasta adicional
      headless: true, // Executar sem abrir o navegador
      devtools: false, // Não abrir devtools
      useChrome: true, // Usar Chrome em vez de Chromium
      debug: false, // Debug
    }
  )
  .then((client: Whatsapp) => start(client))
  .catch((error: any) => {
    console.log(error);
  });

function start(client: Whatsapp) {
  client.onMessage(async (message) => {
    try {
      const phoneNumber = message.sender.id.split("@")[0];

      const data = await catchSuspiciousMessage({
        message: message.body,
        name: message.sender.name,
        phoneNumber,
      });

      if (data.scam_detected) {
        if (message.isGroupMsg) {
          client.sendText(
            `${CLIENT_NUMBER}@c.us`,
            `*Aviso Importante!*

Prezado(a) ${CLIENT_NAME}, 

Gostaríamos de alertá-lo(a) que o número ${formatPhoneNumber(
              phoneNumber
            )} está enviando mensagens fraudulentas no grupo ${message}, com a intenção de aplicar golpes. Pedimos que, por favor, tome as seguintes medidas de segurança:

*Bloqueie o número:* Evite qualquer contato com o número em questão.
*Não responda:* Não forneça nenhuma informação pessoal ou financeira.
*Avise os outros:* Informe os demais integrantes do grupo para que também tomem precauções.
*Reporte:* Caso tenha recebido mensagens suspeitas, reporte para que possamos tomar as devidas providências.

A sua segurança é nossa prioridade. Agradecemos pela atenção e colaboração.

Atenciosamente,`
          );
        } else {
          client.sendText(
            `${CLIENT_NUMBER}@c.us`,
            `*Aviso Importante!*
    
Prezado(a) ${CLIENT_NAME}, 

Gostaríamos de alertá-lo(a) que o número ${formatPhoneNumber(
              phoneNumber
            )} está enviando mensagens fraudulentas com a intenção de aplicar golpes. Pedimos que, por favor, tome as seguintes medidas de segurança:

*Bloqueie o número:* Evite qualquer contato com o número em questão.
*Não responda:* Não forneça nenhuma informação pessoal ou financeira.
*Reporte:* Caso tenha recebido mensagens suspeitas, reporte para que possamos tomar as devidas providências.

A sua segurança é nossa prioridade. Agradecemos pela atenção e colaboração.

Atenciosamente,`
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
}
