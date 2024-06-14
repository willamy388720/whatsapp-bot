import {
  catchSuspiciousMessage,
  createSuspiciousMessage,
} from "./services/api";
import { Message, Whatsapp } from "venom-bot";
import { formatPhoneNumber } from "./utils/formatPhoneNumber";
import { env } from "./env";

const venom = require("venom-bot");

const CLIENT_NUMBER = env.CLIENT_NUMBER;
const CLIENT_NAME = env.CLIENT_NAME;

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
  try {
    let maliciousMessage = "";
    let maliciousPhoneNumber = "";
    let maliciousContactName = "";

    client.onMessage(async (message) => {
      const phoneNumber = message.sender.id.split("@")[0];

      // if (phoneNumber === CLIENT_NUMBER) return;

      const data = await catchSuspiciousMessage({
        message: message.body,
        phoneNumber,
      });

      if (data.scam_detected) {
        maliciousMessage = message.body;
        maliciousPhoneNumber = phoneNumber;
        maliciousContactName = message.sender.name;

        if (message.isGroupMsg) {
          client.sendText(
            `${CLIENT_NUMBER}@c.us`,
            `*Aviso Importante!*

      Prezado(a) ${CLIENT_NAME},

      Gostaríamos de alertá-lo(a) que o número ${formatPhoneNumber(
        phoneNumber
      )} está enviando mensagens fraudulentas no grupo ${
              message.groupInfo.name
            }, com a intenção de aplicar golpes. Pedimos que, por favor, tome as seguintes medidas de segurança:

      - *Bloqueie o número:* Evite qualquer contato com o número em questão.
      - *Não responda:* Não forneça nenhuma informação pessoal ou financeira.
      - *Avise os outros:* Informe os demais integrantes do grupo para que também tomem precauções.
      - *Reporte:* Caso tenha recebido mensagens suspeitas, reporte para que possamos tomar as devidas providências.

      A sua segurança é nossa prioridade. Agradecemos pela atenção e colaboração.

      *Deseja salvar o contato na nossa lista Negra? Responda com SIM ou NÃO*`
          );
        } else {
          client.sendText(
            `${CLIENT_NUMBER}@c.us`,
            `*Aviso Importante!*

      Prezado(a) ${CLIENT_NAME},

      Gostaríamos de alertá-lo(a) que o número ${formatPhoneNumber(
        phoneNumber
      )} está enviando mensagens fraudulentas com a intenção de aplicar golpes. Pedimos que, por favor, tome as seguintes medidas de segurança:

      - *Bloqueie o número:* Evite qualquer contato com o número em questão.
      - *Não responda:* Não forneça nenhuma informação pessoal ou financeira.
      - *Reporte:* Caso tenha recebido mensagens suspeitas, reporte para que possamos tomar as devidas providências.

      A sua segurança é nossa prioridade. Agradecemos pela atenção e colaboração.

      Deseja salvar o contato na nossa lista Negra? Responda com SIM ou NÃO*`
          );
        }
      }

      if (maliciousMessage !== "") {
        await customerDecision(
          client,
          message,
          maliciousMessage,
          maliciousContactName,
          maliciousPhoneNumber
        );
        maliciousMessage = "";
        maliciousContactName = "";
        maliciousPhoneNumber = "";
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function customerDecision(
  client: Whatsapp,
  message: Message,
  maliciousMessage: string,
  maliciousNameContact: string,
  malicousPhoneNumberContact: string
) {
  if (
    message.body.toLocaleLowerCase() === "sim" &&
    message.from === `${CLIENT_NUMBER}@c.us`
  ) {
    try {
      await createSuspiciousMessage({
        message: maliciousMessage,
        name: maliciousNameContact,
        phoneNumber: malicousPhoneNumberContact,
      });

      client.sendText(
        `${CLIENT_NUMBER}@c.us`,
        `Agradecemos por sua resposta. O número ${formatPhoneNumber(
          malicousPhoneNumberContact
        )} foi adicionado à nossa lista negra. Embora isso não impeça que ele envie mensagens através do WhatsApp, é uma medida preventiva importante.

Recomendamos que você também bloqueie o número diretamente no WhatsApp para evitar futuros contatos indesejados. Continuamos à disposição para ajudar em qualquer outra dúvida ou questão de segurança.

A sua segurança é nossa prioridade. Obrigado por colaborar conosco.`
      );
    } catch (error) {
      throw error;
    }
  } else {
    client.sendText(
      `${CLIENT_NUMBER}@c.us`,
      `Agradecemos por sua resposta. Respeitamos sua decisão de não adicionar o número ${formatPhoneNumber(
        malicousPhoneNumberContact
      )} à nossa lista negra. 

Lembramos que é importante continuar atento(a) e seguir as medidas de segurança recomendadas:
- Bloqueie o número em seu dispositivo.
- Não responda nem forneça informações pessoais ou financeiras.
- Reporte qualquer mensagem suspeita que receber.

Caso mude de ideia ou precise de assistência adicional, estamos à disposição para ajudar.

A sua segurança é nossa prioridade. Obrigado por colaborar conosco.`
    );
  }
}
