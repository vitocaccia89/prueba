// Importar módulos de JavaScript necesarios
import { validate } from 'https://cdn.jsdelivr.net/npm/email-validator@3.1.1/dist/email-validator.js';
import { match } from 'https://cdn.skypack.dev/re';

function extraerCorreos() {
    const dominiosInput = document.getElementById('dominios');
    const emailResults = document.getElementById('email-results');
    const dominios = dominiosInput.value.trim().split("\n");
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    emailResults.innerText = "";

    dominios.forEach(async (dominio) => {
        try {
            const response = await fetch(dominio, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'omit',
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            });
            const htmlContent = await response.text();
            const newEmails = match(emailRegex, htmlContent) || [];
            const uniqueEmails = new Set();

            for (const email of newEmails) {
                try {
                    const validEmail = await validateEmail(email);
                    if (validEmail) {
                        uniqueEmails.add(email);
                    }
                } catch (error) {
                    // Ignorar errores de validación de correo electrónico
                }
            }

            const filteredEmails = new Set();
            for (const email of uniqueEmails) {
                // Agrega aquí tus reglas de filtrado adicional si es necesario
                if (!email.endsWith('@sentry.wixpress.com') && !email.endsWith('@sentry-next.wixpress.com')) {
                    filteredEmails.add(email);
                }
            }

            filteredEmails.forEach((email) => {
                emailResults.innerText += email + '\n';
            });
        } catch (error) {
            console.error('Error al acceder al dominio:', dominio);
            console.error(error);
        }
    });
}

function validateEmail(email) {
    return new Promise((resolve, reject) => {
        validate(email)
            .then((valid) => {
                resolve(valid);
            })
            .catch((error) => {
                reject(error);
            });
    });
}
